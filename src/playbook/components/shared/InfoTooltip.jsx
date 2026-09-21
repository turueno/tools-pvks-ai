// src/playbook/components/shared/InfoTooltip.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons.jsx';

/**
 * InfoTooltip
 * Muestra un discreto indicador informativo (ℹ) o badge que despliega un tooltip flotante
 * con fondo oscuro elegante, contraste alto y flecha indicadora.
 * Permite ganar valioso espacio vertical para fotos y fichas de datos.
 */
export default function InfoTooltip({
  content,
  title = null,
  position = 'top', // 'top' | 'bottom' | 'right' | 'left'
  icon = 'info',
  size = 14,
  badgeText = null, // Si se proporciona, muestra una píldora con texto e icono
  color = '#64748B',
  hoverColor = '#F6911E',
  maxWidth = 320,
  style = {}
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!content) return null;

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom':
        return {
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'right':
        return {
          left: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'left':
        return {
          right: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'top':
      default:
        return {
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)'
        };
    }
  };

  return (
    <span
      ref={triggerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        cursor: 'help',
        userSelect: 'none',
        ...style
      }}
      onMouseEnter={() => {
        setIsVisible(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsVisible(false);
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsVisible(prev => !prev);
      }}
      tabIndex={0}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-label={title || 'Información adicional'}
    >
      {badgeText ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: isHovered ? '#FFF7ED' : '#F1F5F9',
            color: isHovered ? '#C25E00' : '#475569',
            border: `1px solid ${isHovered ? '#FFEDD5' : '#E2E8F0'}`,
            transition: 'all 0.15s ease'
          }}
        >
          <Icon name={icon} size={size} color={isHovered ? hoverColor : color} />
          <span>{badgeText}</span>
        </span>
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size + 8}px`,
            height: `${size + 8}px`,
            borderRadius: '50%',
            backgroundColor: isHovered ? 'rgba(246, 145, 30, 0.12)' : 'transparent',
            color: isHovered ? hoverColor : color,
            transition: 'all 0.15s ease'
          }}
        >
          <Icon name={icon} size={size} color={isHovered ? hoverColor : color} />
        </span>
      )}

      {/* Floating Tooltip Box */}
      {isVisible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 9999,
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            lineHeight: 1.45,
            width: 'max-content',
            maxWidth: `${maxWidth}px`,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            textAlign: 'left',
            animation: 'fadeIn 0.15s ease-out',
            ...getPositionStyles()
          }}
        >
          {title && (
            <div
              style={{
                fontWeight: 800,
                color: '#FFAA34',
                marginBottom: '4px',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{title}</span>
            </div>
          )}
          <div style={{ color: '#E2E8F0', fontWeight: 400 }}>
            {content}
          </div>
        </div>
      )}
    </span>
  );
}
