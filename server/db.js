// server/db.js
// Gestor de persistencia híbrido: PostgreSQL (Railway DATABASE_URL) con fallback a Almacén JSON

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const LOCAL_STORE_FILE = path.join(DATA_DIR, 'cloud_store.json');

// Variables de estado
let pgPool = null;
let isPostgresActive = false;
let dbInitError = null;
let detectedUrlName = null;
let fileCache = {
  dictionary: {},
  playbooks: {},
  tokens: [],
  audit: []
};

// Cargar o inicializar archivo local de respaldo
function initFileStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
      fileCache = JSON.parse(raw);
    } else {
      saveFileStore();
    }
    console.log('[DB] Almacén de respaldo local inicializado en:', LOCAL_STORE_FILE);
  } catch (err) {
    console.warn('[DB] Advertencia al inicializar almacén local:', err.message);
  }
}

function saveFileStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(fileCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error al guardar en almacén local:', err.message);
  }
}

// Inicializar la conexión a PostgreSQL si DATABASE_URL existe
export async function initDatabase() {
  initFileStore();

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_PRIVATE_URL ||
    process.env.DATABASE_PUBLIC_URL ||
    (process.env.PGHOST ? `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || ''}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'railway'}` : null);

  if (process.env.DATABASE_URL) detectedUrlName = 'DATABASE_URL';
  else if (process.env.DATABASE_PRIVATE_URL) detectedUrlName = 'DATABASE_PRIVATE_URL';
  else if (process.env.DATABASE_PUBLIC_URL) detectedUrlName = 'DATABASE_PUBLIC_URL';
  else if (process.env.PGHOST) detectedUrlName = 'PGHOST';

  if (!connectionString) {
    console.log('[DB] DATABASE_URL no detectada. Operando en modo archivo de persistencia local.');
    return { type: 'file', active: true };
  }

  try {
    console.log(`[DB] Conectando a PostgreSQL de Railway usando ${detectedUrlName}...`);
    pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('.railway.internal') ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    const client = await pgPool.connect();
    console.log('[DB] ¡Conexión exitosa a PostgreSQL!');

    // Crear tablas automáticas si no existen
    await client.query(`
      CREATE TABLE IF NOT EXISTS pvks_dictionary (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pvks_playbooks (
        project_id VARCHAR(255) PRIMARY KEY,
        data_json JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pvks_tokens (
        token_id VARCHAR(255) PRIMARY KEY,
        payload_json JSONB NOT NULL,
        estado VARCHAR(50) DEFAULT 'ACTIVO',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pvks_audit (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(100) NOT NULL,
        detalles_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
    isPostgresActive = true;
    dbInitError = null;
    console.log('[DB] Esquema relacional de tablas verificado.');
    return { type: 'postgres', active: true };
  } catch (err) {
    console.error('[DB] Fallo al conectar con PostgreSQL:', err.message);
    dbInitError = err.message;
    isPostgresActive = false;
    return { type: 'file_fallback', active: true, error: err.message };
  }
}

// Operaciones para el Diccionario de Copys (Meta-Admin)
export async function getDictionaryFromDb() {
  if (isPostgresActive && pgPool) {
    try {
      const res = await pgPool.query('SELECT key, value FROM pvks_dictionary');
      const dict = {};
      for (const row of res.rows) {
        dict[row.key] = row.value;
      }
      return dict;
    } catch (e) {
      console.error('[DB] Error leyendo diccionario de Postgres:', e.message);
    }
  }
  return fileCache.dictionary || {};
}

export async function saveDictionaryToDb(dictObj) {
  if (!dictObj || typeof dictObj !== 'object') return false;

  fileCache.dictionary = { ...(fileCache.dictionary || {}), ...dictObj };
  saveFileStore();

  if (isPostgresActive && pgPool) {
    try {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');
        for (const [key, value] of Object.entries(dictObj)) {
          await client.query(`
            INSERT INTO pvks_dictionary (key, value, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (key) DO UPDATE
            SET value = EXCLUDED.value, updated_at = NOW()
          `, [key, String(value)]);
        }
        await client.query('COMMIT');
        return true;
      } catch (e) {
        await client.query('ROLLBACK');
        console.error('[DB] Error guardando diccionario en Postgres:', e.message);
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('[DB] Error de cliente Postgres:', err.message);
    }
  }
  return true;
}

// Operaciones para Playbook Datasets
export async function getPlaybookDataFromDb(projectId) {
  if (!projectId) return null;

  if (isPostgresActive && pgPool) {
    try {
      const res = await pgPool.query('SELECT data_json FROM pvks_playbooks WHERE project_id = $1', [projectId]);
      if (res.rows.length > 0) {
        return res.rows[0].data_json;
      }
    } catch (e) {
      console.error(`[DB] Error leyendo playbook ${projectId} de Postgres:`, e.message);
    }
  }
  return fileCache.playbooks?.[projectId] || null;
}

export async function savePlaybookDataToDb(projectId, dataObj) {
  if (!projectId || !dataObj) return false;

  if (!fileCache.playbooks) fileCache.playbooks = {};
  fileCache.playbooks[projectId] = dataObj;
  saveFileStore();

  if (isPostgresActive && pgPool) {
    try {
      await pgPool.query(`
        INSERT INTO pvks_playbooks (project_id, data_json, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (project_id) DO UPDATE
        SET data_json = EXCLUDED.data_json, updated_at = NOW()
      `, [projectId, dataObj]);
      return true;
    } catch (e) {
      console.error(`[DB] Error guardando playbook ${projectId} en Postgres:`, e.message);
    }
  }
  return true;
}

// Operaciones para Tokens Blindados (Clientes)
export async function getTokensFromDb() {
  if (isPostgresActive && pgPool) {
    try {
      const res = await pgPool.query('SELECT payload_json, estado FROM pvks_tokens ORDER BY updated_at DESC');
      return res.rows.map(r => ({
        ...r.payload_json,
        estado: r.estado
      }));
    } catch (e) {
      console.error('[DB] Error leyendo tokens de Postgres:', e.message);
    }
  }
  return fileCache.tokens || [];
}

export async function saveTokenToDb(tokenObj) {
  if (!tokenObj || !tokenObj.tokenId) return false;

  const existingIdx = (fileCache.tokens || []).findIndex(t => t.tokenId === tokenObj.tokenId);
  if (existingIdx >= 0) {
    fileCache.tokens[existingIdx] = tokenObj;
  } else {
    fileCache.tokens = [tokenObj, ...(fileCache.tokens || [])];
  }
  saveFileStore();

  if (isPostgresActive && pgPool) {
    try {
      await pgPool.query(`
        INSERT INTO pvks_tokens (token_id, payload_json, estado, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (token_id) DO UPDATE
        SET payload_json = EXCLUDED.payload_json, estado = EXCLUDED.estado, updated_at = NOW()
      `, [tokenObj.tokenId, tokenObj, tokenObj.estado || 'ACTIVO']);
      return true;
    } catch (e) {
      console.error('[DB] Error guardando token en Postgres:', e.message);
    }
  }
  return true;
}

export async function revokeTokenInDb(tokenId) {
  if (!tokenId) return false;

  if (fileCache.tokens) {
    fileCache.tokens = fileCache.tokens.map(t => t.tokenId === tokenId ? { ...t, estado: 'REVOCADO' } : t);
    saveFileStore();
  }

  if (isPostgresActive && pgPool) {
    try {
      await pgPool.query(`
        UPDATE pvks_tokens
        SET estado = 'REVOCADO',
            payload_json = jsonb_set(payload_json, '{estado}', '"REVOCADO"'),
            updated_at = NOW()
        WHERE token_id = $1
      `, [tokenId]);
      return true;
    } catch (e) {
      console.error('[DB] Error revocando token en Postgres:', e.message);
    }
  }
  return true;
}

// Operaciones para Bitácora de Auditoría
export async function getAuditLogsFromDb() {
  if (isPostgresActive && pgPool) {
    try {
      const res = await pgPool.query('SELECT tipo, detalles_json, created_at FROM pvks_audit ORDER BY created_at DESC LIMIT 200');
      return res.rows.map(r => ({
        tipo: r.tipo,
        ...r.detalles_json,
        fecha: r.created_at
      }));
    } catch (e) {
      console.error('[DB] Error leyendo auditoría de Postgres:', e.message);
    }
  }
  return fileCache.audit || [];
}

export async function recordAuditInDb(auditObj) {
  if (!auditObj) return false;

  const eventWithDate = {
    ...auditObj,
    fecha: auditObj.fecha || new Date().toISOString()
  };

  fileCache.audit = [eventWithDate, ...(fileCache.audit || []).slice(0, 199)];
  saveFileStore();

  if (isPostgresActive && pgPool) {
    try {
      await pgPool.query(`
        INSERT INTO pvks_audit (tipo, detalles_json, created_at)
        VALUES ($1, $2, NOW())
      `, [auditObj.tipo || 'INFO', auditObj]);
      return true;
    } catch (e) {
      console.error('[DB] Error guardando auditoría en Postgres:', e.message);
    }
  }
  return true;
}

export function isDbConnected() {
  return isPostgresActive;
}

export function getDbStatus() {
  return {
    postgresActive: isPostgresActive,
    detectedEnvVar: detectedUrlName,
    initError: dbInitError
  };
}
