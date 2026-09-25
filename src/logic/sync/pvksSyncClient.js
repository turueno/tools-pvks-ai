// src/logic/sync/pvksSyncClient.js
// Cliente de sincronización en tiempo real para conectar el frontend con la API y Base de Datos

const API_BASE = '/api';

/**
 * Obtener el diccionario de textos guardado en la base de datos
 */
export async function fetchCloudDictionary() {
  try {
    const res = await fetch(`${API_BASE}/dictionary`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.dictionary) {
      return json.dictionary;
    }
  } catch (err) {
    // Si la API no está disponible (modo offline o build estático puro), failover transparente
    console.debug('[SyncClient] API de nube no accesible para diccionario:', err.message);
  }
  return null;
}

/**
 * Guardar el diccionario de textos en la base de datos
 */
export async function saveCloudDictionary(dictionary) {
  try {
    const res = await fetch(`${API_BASE}/dictionary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dictionary })
    });
    return res.ok;
  } catch (err) {
    console.warn('[SyncClient] Error al sincronizar diccionario con la nube:', err.message);
    return false;
  }
}

/**
 * Obtener los datos de un Playbook específico de la base de datos
 */
export async function fetchCloudPlaybookData(projectId) {
  if (!projectId) return null;
  try {
    const res = await fetch(`${API_BASE}/playbooks/${encodeURIComponent(projectId)}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.debug(`[SyncClient] API no accesible para Playbook ${projectId}:`, err.message);
  }
  return null;
}

/**
 * Guardar los datos de un Playbook en la base de datos
 */
export async function saveCloudPlaybookData(projectId, data) {
  if (!projectId || !data) return false;
  try {
    const res = await fetch(`${API_BASE}/playbooks/${encodeURIComponent(projectId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    return res.ok;
  } catch (err) {
    console.warn(`[SyncClient] Error al sincronizar Playbook ${projectId} con la nube:`, err.message);
    return false;
  }
}

/**
 * Obtener todos los tokens blindados de clientes registrados en la nube
 */
export async function fetchCloudTokens() {
  try {
    const res = await fetch(`${API_BASE}/tokens`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.tokens)) {
      return json.tokens;
    }
  } catch (err) {
    console.debug('[SyncClient] API no accesible para tokens:', err.message);
  }
  return null;
}

/**
 * Guardar un token en la base de datos en la nube
 */
export async function saveCloudToken(token) {
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return res.ok;
  } catch (err) {
    console.warn('[SyncClient] Error al guardar token en la nube:', err.message);
    return false;
  }
}

/**
 * Revocar un token en la nube de forma inmediata
 */
export async function revokeCloudToken(tokenId) {
  if (!tokenId) return false;
  try {
    const res = await fetch(`${API_BASE}/tokens/${encodeURIComponent(tokenId)}/revoke`, {
      method: 'POST'
    });
    return res.ok;
  } catch (err) {
    console.warn('[SyncClient] Error al revocar token en la nube:', err.message);
    return false;
  }
}

/**
 * Registrar evento en la bitácora de auditoría en la nube
 */
export async function recordCloudAuditEvent(event) {
  if (!event) return false;
  try {
    await fetch(`${API_BASE}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event })
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtener la contraseña maestra de Meta-Admin de la nube
 */
export async function fetchCloudMasterPass() {
  try {
    const res = await fetch(`${API_BASE}/settings/master-pass`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.masterPass) {
      return json.masterPass;
    }
  } catch (err) {
    console.debug('[SyncClient] API no accesible para master pass:', err.message);
  }
  return null;
}

/**
 * Guardar la contraseña maestra de Meta-Admin en la nube
 */
export async function saveCloudMasterPass(masterPass) {
  if (!masterPass) return false;
  try {
    const res = await fetch(`${API_BASE}/settings/master-pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterPass })
    });
    return res.ok;
  } catch (err) {
    console.warn('[SyncClient] Error al sincronizar master pass con la nube:', err.message);
    return false;
  }
}

