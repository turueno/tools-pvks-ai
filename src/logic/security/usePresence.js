// src/logic/security/usePresence.js
import { useEffect, useRef } from 'react';

export function usePresence(guardContext) {
  const lastActiveTime = useRef(Date.now());

  useEffect(() => {
    if (!guardContext?.isRestricted || !guardContext?.clientTokenPayload) return;
    
    const { tid, pid, cliente } = guardContext.clientTokenPayload;
    
    // Función para actualizar la última interacción
    const markActive = () => {
      lastActiveTime.current = Date.now();
    };

    // Agregar listeners para detectar actividad
    window.addEventListener('mousemove', markActive);
    window.addEventListener('keydown', markActive);
    window.addEventListener('click', markActive);
    window.addEventListener('scroll', markActive);

    const sendHeartbeat = () => {
      let status = 'active';
      
      // Determinar si la pestaña está de fondo
      if (document.visibilityState === 'hidden') {
        status = 'background';
      } 
      // Si lleva más de 3 minutos sin tocar el mouse/teclado, está inactivo
      else if (Date.now() - lastActiveTime.current > 180000) {
        status = 'idle';
      }

      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokenId: tid, 
          playbookId: pid, 
          cliente, 
          status 
        })
      }).catch(err => console.debug('[Presence] Error enviando latido:', err));
    };

    // Enviar el latido inmediatamente al montar
    sendHeartbeat();

    // Enviar latidos cada 15 segundos
    const interval = setInterval(sendHeartbeat, 15000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', markActive);
      window.removeEventListener('keydown', markActive);
      window.removeEventListener('click', markActive);
      window.removeEventListener('scroll', markActive);
    };
  }, [guardContext]);
}
