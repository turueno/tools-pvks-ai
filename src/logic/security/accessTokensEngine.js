// src/logic/security/accessTokensEngine.js
// Motor de emisión, validación y gobierno de tokens seguros para clientes de la Suite PVKS

const TOKENS_STORAGE_KEY = 'pvks_issued_tokens_v1';
const AUDIT_LOG_STORAGE_KEY = 'pvks_audit_log_v1';

export function getIssuedTokens() {
  try {
    const raw = localStorage.getItem(TOKENS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error al leer pvks_issued_tokens_v1:', e);
  }
  return [];
}

export function saveIssuedTokens(tokens) {
  try {
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  } catch (e) {
    console.error('Error al guardar tokens:', e);
  }
}

/**
 * Emite un nuevo token blindado para compartir un Playbook con un cliente
 */
export function issueClientToken({
  playbookId,
  playbookTitulo,
  clienteDestino,
  destinatarioNombre,
  rol = 'viewer', // 'viewer' | 'reviewer'
  duracionDias = 30, // número de días o null para permanente
  watermarkText,
  restrictToPlaybook = true
}) {
  const now = new Date();
  const fechaCreacion = now.toISOString();
  
  let fechaExpiracion = null;
  if (duracionDias && duracionDias > 0) {
    const expDate = new Date(now.getTime() + duracionDias * 24 * 60 * 60 * 1000);
    fechaExpiracion = expDate.toISOString();
  }

  // Generador de ID aleatorio amigable
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const tokenId = `tok_${Date.now().toString(36)}_${randomSuffix}`;

  // Payload seguro codificado en base64 para incluir en la URL
  const tokenPayload = {
    tid: tokenId,
    pid: playbookId,
    cli: clienteDestino,
    rol: rol,
    exp: fechaExpiracion,
    res: restrictToPlaybook ? 1 : 0
  };

  const encodedToken = btoa(unescape(encodeURIComponent(JSON.stringify(tokenPayload))));

  const newTokenRecord = {
    tokenId,
    encodedToken,
    playbookId,
    playbookTitulo,
    clienteDestino,
    destinatarioNombre: destinatarioNombre || clienteDestino,
    rol,
    fechaCreacion,
    fechaExpiracion,
    estado: 'ACTIVO', // 'ACTIVO' | 'REVOCADO' | 'EXPIRADO'
    watermarkText: watermarkText || `DOCUMENTO CONFIDENCIAL · PROPIEDAD DE ${clienteDestino.toUpperCase()}`,
    restrictToPlaybook,
    totalVisitas: 0,
    ultimaVisita: null
  };

  const existingTokens = getIssuedTokens();
  const updatedTokens = [newTokenRecord, ...existingTokens];
  saveIssuedTokens(updatedTokens);

  // Registrar en el log de auditoría
  recordAuditEvent({
    tipo: 'TOKEN_EMITIDO',
    tokenId,
    playbookId,
    cliente: clienteDestino,
    detalles: `Enlace emitido para ${destinatarioNombre || clienteDestino} (Válido: ${duracionDias ? `${duracionDias} días` : 'Permanente'})`
  });

  return newTokenRecord;
}

/**
 * Valida un token recibido en los parámetros de la URL
 */
export function validateClientToken(encodedTokenString) {
  if (!encodedTokenString) return { valid: false, error: 'NO_TOKEN' };

  try {
    const jsonStr = decodeURIComponent(escape(atob(encodedTokenString)));
    const payload = JSON.parse(jsonStr);

    if (!payload.tid || !payload.pid) {
      return { valid: false, error: 'TOKEN_MALFORMADO' };
    }

    // Buscar en el registro de tokens emitidos
    const allTokens = getIssuedTokens();
    const tokenRecord = allTokens.find(t => t.tokenId === payload.tid);

    // Si el token fue revocado explícitamente por el administrador
    if (tokenRecord && tokenRecord.estado === 'REVOCADO') {
      return {
        valid: false,
        error: 'REVOCADO',
        mensaje: 'Este enlace de acceso ha sido revocado por la dirección de Provokers.'
      };
    }

    // Comprobar expiración temporal
    if (payload.exp) {
      const expDate = new Date(payload.exp);
      if (new Date() > expDate) {
        if (tokenRecord && tokenRecord.estado !== 'EXPIRADO') {
          tokenRecord.estado = 'EXPIRADO';
          saveIssuedTokens(allTokens);
        }
        return {
          valid: false,
          error: 'EXPIRADO',
          mensaje: 'El periodo de vigencia de este enlace de consulta ha finalizado.'
        };
      }
    }

    // Si es válido, actualizar contadores de visita
    if (tokenRecord) {
      tokenRecord.totalVisitas = (tokenRecord.totalVisitas || 0) + 1;
      tokenRecord.ultimaVisita = new Date().toISOString();
      saveIssuedTokens(allTokens);
    }

    recordAuditEvent({
      tipo: 'ACCESO_PLAYBOOK',
      tokenId: payload.tid,
      playbookId: payload.pid,
      cliente: payload.cli || tokenRecord?.clienteDestino,
      detalles: `Apertura exitosa de Playbook por ${payload.cli || 'Cliente'}`
    });

    return {
      valid: true,
      tokenRecord: tokenRecord || {
        tokenId: payload.tid,
        playbookId: payload.pid,
        clienteDestino: payload.cli,
        rol: payload.rol || 'viewer',
        watermarkText: `DOCUMENTO CONFIDENCIAL · PROPIEDAD DE ${(payload.cli || 'CLIENTE').toUpperCase()}`,
        restrictToPlaybook: payload.res === 1
      }
    };
  } catch (err) {
    console.error('Error al validar token:', err);
    return { valid: false, error: 'TOKEN_INVALIDO', mensaje: 'El formato de enlace de acceso no es válido.' };
  }
}

/**
 * Revocar un token inmediatamente en un clic
 */
export function revokeClientToken(tokenId) {
  const allTokens = getIssuedTokens();
  const updated = allTokens.map(t => {
    if (t.tokenId === tokenId) {
      return { ...t, estado: 'REVOCADO', fechaRevocacion: new Date().toISOString() };
    }
    return t;
  });
  saveIssuedTokens(updated);

  recordAuditEvent({
    tipo: 'TOKEN_REVOCADO',
    tokenId,
    detalles: 'El token de acceso fue cancelado por el administrador.'
  });

  return updated;
}

/**
 * Registro de Trazabilidad y Auditoría (Audit Log)
 */
export function getAuditLog() {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn(e);
  }
  return [];
}

export function recordAuditEvent({ tipo, tokenId, playbookId, cliente, detalles }) {
  try {
    const existing = getAuditLog();
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      tipo,
      tokenId: tokenId || null,
      playbookId: playbookId || null,
      cliente: cliente || null,
      detalles: detalles || ''
    };
    // Mantener los últimos 200 eventos
    const updated = [event, ...existing].slice(0, 200);
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error al registrar evento de auditoría:', e);
  }
}
