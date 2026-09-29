import { useEffect, useRef } from 'react';
import { recordCloudAuditEvent } from './pvksSyncClient.js';

export function useTelemetry(guardContext, currentView) {
  const sessionStartTime = useRef(Date.now());
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!guardContext?.isRestricted || !guardContext?.tokenData) return;
    const { tokenId: tid, playbookId: pid } = guardContext.tokenData;

    // 1. Registro de Acceso inicial (solo una vez por sesión de navegador)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      sessionStartTime.current = Date.now();
      
      // El backend ya registra ACCESO_PLAYBOOK al validar el token, 
      // pero podemos registrar un inicio de sesión activo en UI.
      recordCloudAuditEvent({
        tipo: 'SESION_INICIADA',
        tokenId: tid,
        playbookId: pid,
        detalles: 'El usuario ingresó exitosamente al entorno del Playbook.'
      });
    }

    // 2. Monitoreo de módulos vistos
    if (currentView) {
      recordCloudAuditEvent({
        tipo: 'NAVEGACION',
        tokenId: tid,
        playbookId: pid,
        detalles: `Visualizando módulo: ${currentView.toUpperCase()}`
      });
    }

    // 3. Capturar el cierre de la pestaña o navegador
    const handleUnload = () => {
      const durationSecs = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      const minutes = Math.floor(durationSecs / 60);
      const seconds = durationSecs % 60;
      const durationText = `${minutes} min ${seconds} seg`;

      // Como la pestaña se está cerrando, usamos sendBeacon para asegurar que llegue al servidor
      const payload = JSON.stringify({
        event: {
          tipo: 'SESION_CERRADA',
          tokenId: tid,
          playbookId: pid,
          detalles: `El usuario cerró el Playbook o recargó la página. Tiempo activo en la sesión: ${durationText}.`
        }
      });
      // Importante: sendBeacon manda peticiones POST rápidamente antes de que el navegador mate el proceso
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/audit', blob);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [guardContext, currentView]);
}
