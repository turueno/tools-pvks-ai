import { useEffect, useRef } from 'react';
import { recordAuditEvent } from '../security/accessTokensEngine.js';

export function useTelemetry(guardContext, currentView) {
  const sessionStartTime = useRef(Date.now());
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!guardContext?.isRestricted || !guardContext?.tokenData) return;
    const { tokenId: tid, playbookId: pid } = guardContext.tokenData;
    const cliente = guardContext.tokenData.clienteDestino || 'Cliente';

    // 1. Registro de Acceso inicial
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      sessionStartTime.current = Date.now();
      
      recordAuditEvent({
        tipo: 'SESION_INICIADA',
        tokenId: tid,
        playbookId: pid,
        cliente,
        detalles: 'El usuario interactuó con la interfaz del Playbook.'
      });
    }

    // 2. Monitoreo de módulos vistos
    if (currentView) {
      recordAuditEvent({
        tipo: 'NAVEGACION',
        tokenId: tid,
        playbookId: pid,
        cliente,
        detalles: `Visualizando módulo: ${currentView.toUpperCase()}`
      });
    }

    // 3. Capturar el cierre de la pestaña o navegador
    const handleUnload = () => {
      const durationSecs = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      const minutes = Math.floor(durationSecs / 60);
      const seconds = durationSecs % 60;
      const durationText = `${minutes} min ${seconds} seg`;

      const event = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        tipo: 'SESION_CERRADA',
        tokenId: tid,
        playbookId: pid,
        cliente,
        detalles: `El usuario cerró el Playbook. Tiempo activo: ${durationText}.`
      };

      // Guardar localmente
      recordAuditEvent(event);
      
      // Enviar por beacon directo
      const blob = new Blob([JSON.stringify({ event })], { type: 'application/json' });
      navigator.sendBeacon('/api/audit', blob);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [guardContext, currentView]);
}
