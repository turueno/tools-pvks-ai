// server/api.js
// Router de la API REST para sincronización en tiempo real

import express from 'express';
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

const router = express.Router();

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

