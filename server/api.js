// server/api.js
// Router de la API REST para sincronización en tiempo real

import express from 'express';
import multer from 'multer';
import officeParser from 'officeparser';
import * as pdfParseModule from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import {
  getDictionaryFromDb,
  saveDictionaryToDb,
  getPlaybookDataFromDb,
  savePlaybookDataToDb,
  getTokensFromDb,
  saveTokenToDb,
  revokeTokenInDb,
  getAuditLogsFromDb,
  recordAuditInDb,
  isDbConnected,
  getDbStatus,
  getMasterPassFromDb,
  saveMasterPassToDb
} from './db.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSIONS_DIR = path.resolve(__dirname, '../data/ingest_sessions');

const router = express.Router();

// Configuración de multer para carga de archivos
const upload = multer({ dest: 'uploads/' });

// Asegurar directorio de sesiones de ingesta y uploads
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}
if (!fs.existsSync('uploads/temp')) {
  fs.mkdirSync('uploads/temp', { recursive: true });
}

// Ruta de Ingestión Multi-Formato con Persistencia
router.post('/ingest/extract', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
  }
  
  try {
    const filePath = req.file.path;
    const originalName = req.file.originalname || 'documento';
    let text = '';
    
    if (originalName.toLowerCase().endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const p = new pdfParseModule.PDFParse({ data: new Uint8Array(dataBuffer) });
      const doc = await p.load();
      const pdfResult = await p.getText();
      text = pdfResult.text;
    } else {
      officeParser.setDecompressionLocation('uploads/temp');
      text = await officeParser.parseOfficeAsync(filePath);
    }

    // Generar sessionId único para este insumo
    const cleanSlug = originalName.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'doc';
    const sessionId = `${cleanSlug}-${Date.now().toString(36)}`;
    const sessionPath = path.join(SESSIONS_DIR, sessionId);
    const inputsPath = path.join(sessionPath, 'inputs');

    fs.mkdirSync(inputsPath, { recursive: true });

    // 1. Guardar copia del archivo original en data/ingest_sessions/<sessionId>/inputs/
    const destinationPath = path.join(inputsPath, originalName);
    fs.copyFileSync(filePath, destinationPath);

    // 2. Guardar texto extraído íntegro en data/ingest_sessions/<sessionId>/raw_text.txt
    fs.writeFileSync(path.join(sessionPath, 'raw_text.txt'), text || '', 'utf-8');

    // 3. Guardar metadatos de la sesión
    const sessionMeta = {
      sessionId,
      originalName,
      fileSize: req.file.size,
      charCount: text.length,
      createdAt: new Date().toISOString(),
      status: 'extracted_pending_synthesis'
    };
    fs.writeFileSync(path.join(sessionPath, 'session_meta.json'), JSON.stringify(sessionMeta, null, 2), 'utf-8');
    
    // Limpiar archivo temporal de multer
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error eliminando archivo temporal de multer:', err);
    });
    
    res.json({
      success: true,
      text,
      sessionId,
      originalName,
      charCount: text.length,
      sessionPath
    });
  } catch (error) {
    console.error('Error al parsear el documento:', error);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ success: false, error: 'Fallo al procesar el archivo. El formato podría no ser compatible.' });
  }
});

// Guardar borrador FPO en la sesión y sincronizar con base de datos
router.post('/ingest/save-draft', async (req, res) => {
  try {
    const { sessionId, playbookProject, dataset } = req.body;
    if (!playbookProject || !playbookProject.id) {
      return res.status(400).json({ success: false, error: 'Datos de proyecto incompletos' });
    }

    if (sessionId) {
      const sessionPath = path.join(SESSIONS_DIR, sessionId);
      if (fs.existsSync(sessionPath)) {
        fs.writeFileSync(path.join(sessionPath, 'fpo_playbook_meta.json'), JSON.stringify(playbookProject, null, 2), 'utf-8');
        fs.writeFileSync(path.join(sessionPath, 'fpo_dataset.json'), JSON.stringify(dataset || {}, null, 2), 'utf-8');
        
        // Crear manifiesto para Antigravity
        const manifest = {
          instruccion: `Procesamiento de síntesis profunda para Playbook: ${playbookProject.titulo}`,
          playbookId: playbookProject.id,
          sessionId,
          inputsDir: path.join(sessionPath, 'inputs'),
          rawTextPath: path.join(sessionPath, 'raw_text.txt'),
          fpoDatasetPath: path.join(sessionPath, 'fpo_dataset.json'),
          enabledModules: playbookProject.enabledModules || [],
          status: 'ready_for_antigravity',
          updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(path.join(sessionPath, 'antigravity_manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
      }
    }

    // Persistir también en base de datos cloud_store.json
    if (dataset) {
      await savePlaybookDataToDb(playbookProject.id, dataset);
    }

    res.json({ success: true, message: 'Borrador FPO guardado exitosamente' });
  } catch (err) {
    console.error('Error al guardar borrador FPO:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Listar sesiones de ingesta registradas
router.get('/ingest/sessions', (req, res) => {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      return res.json({ success: true, sessions: [] });
    }
    const dirs = fs.readdirSync(SESSIONS_DIR);
    const sessions = [];
    dirs.forEach(d => {
      const metaPath = path.join(SESSIONS_DIR, d, 'session_meta.json');
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
          sessions.push(meta);
        } catch {}
      }
    });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SISTEMA DE PRESENCIA EN VIVO (HEARTBEAT) ---
const activeSessions = {};

// Recibir latido del cliente
router.post('/presence/heartbeat', (req, res) => {
  const { tokenId, playbookId, cliente, status } = req.body;
  if (!tokenId) return res.status(400).json({ error: 'Falta token' });

  activeSessions[tokenId] = {
    playbookId,
    cliente,
    status, // 'active', 'idle', 'background'
    lastSeen: Date.now()
  };
  res.json({ success: true });
});

// Meta-Admin: Consultar quién está online (y limpiar inactivos)
router.get('/presence/active', (req, res) => {
  const now = Date.now();
  const online = [];
  
  for (const [tokenId, session] of Object.entries(activeSessions)) {
    // Si pasaron más de 35 segundos sin latido, se asume que cerró la pestaña
    if (now - session.lastSeen > 35000) {
      delete activeSessions[tokenId];
    } else {
      online.push({ tokenId, ...session });
    }
  }
  res.json({ success: true, sessions: online });
});

// Health check
router.get('/health', (req, res) => {
  const dbInfo = getDbStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    storageMode: dbInfo.storageMode,
    mountPath: dbInfo.mountPath,
    postgresActive: dbInfo.postgresActive,
    detectedEnvVar: dbInfo.detectedEnvVar,
    connectionSummary: dbInfo.connectionSummary,
    dbError: dbInfo.initError,
    environment: process.env.NODE_ENV || 'production'
  });
});

// DICCIONARIO DE COPYS (Meta-Admin)
router.get('/dictionary', async (req, res) => {
  try {
    const dict = await getDictionaryFromDb();
    res.json({ success: true, dictionary: dict });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/dictionary', async (req, res) => {
  try {
    const { dictionary } = req.body;
    if (!dictionary || typeof dictionary !== 'object') {
      return res.status(400).json({ success: false, error: 'Diccionario inválido' });
    }
    await saveDictionaryToDb(dictionary);
    res.json({ success: true, message: 'Diccionario persistido con éxito' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PLAYBOOK DATASETS (Evidencias, Insights, etc.)
router.get('/playbooks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getPlaybookDataFromDb(id);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Playbook no encontrado' });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/playbooks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Data de Playbook inválida' });
    }
    await savePlaybookDataToDb(id, data);
    res.json({ success: true, message: `Playbook ${id} persistido con éxito` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TOKENS BLINDADOS PARA CLIENTES
router.get('/tokens', async (req, res) => {
  try {
    const tokens = await getTokensFromDb();
    res.json({ success: true, tokens });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/tokens', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || !token.tokenId) {
      return res.status(400).json({ success: false, error: 'Token inválido' });
    }
    await saveTokenToDb(token);
    res.json({ success: true, message: 'Token guardado en la nube' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/tokens/:id/revoke', async (req, res) => {
  try {
    const { id } = req.params;
    await revokeTokenInDb(id);
    res.json({ success: true, message: `Token ${id} revocado en la nube` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// BITÁCORA DE AUDITORÍA
router.get('/audit', async (req, res) => {
  try {
    const logs = await getAuditLogsFromDb();
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/audit', async (req, res) => {
  try {
    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ success: false, error: 'Evento de auditoría inválido' });
    }
    await recordAuditInDb(event);
    res.json({ success: true, message: 'Evento de auditoría registrado' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CONFIGURACIONES (Meta-Admin Master Pass)
router.get('/settings/master-pass', async (req, res) => {
  try {
    const pass = await getMasterPassFromDb();
    res.json({ success: true, masterPass: pass });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/settings/master-pass', async (req, res) => {
  try {
    const { masterPass } = req.body;
    if (!masterPass) {
      return res.status(400).json({ success: false, error: 'Contraseña inválida' });
    }
    await saveMasterPassToDb(masterPass);
    res.json({ success: true, message: 'Master Pass actualizado en la nube' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

