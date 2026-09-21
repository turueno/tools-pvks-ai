// src/playbook/components/EpistemicBadge.jsx
import React from 'react';
import { EPISTEMIC_LEVELS } from '../data/schema.js';

export default function EpistemicBadge({ level = 'DERIVADO', size = 'normal', showTooltip = true }) {
  const epistemic = EPISTEMIC_LEVELS[level] || EPISTEMIC_LEVELS.DERIVADO;

  const isSmall = size === 'small';

  return (
    <span
      className={`epistemic-badge ${epistemic.badgeClass}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        borderRadius: '9999px',
        fontSize: isSmall ? '0.7rem' : '0.78rem',
        fontWeight: '700',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        backgroundColor: epistemic.bg,
        color: epistemic.color,
        border: `1px solid ${epistemic.border}`,
        lineHeight: 1.2,
        userSelect: 'none'
      }}
      title={showTooltip ? `${epistemic.label}: ${epistemic.description}` : undefined}
    >
      <span
        style={{
          width: isSmall ? '5px' : '7px',
          height: isSmall ? '5px' : '7px',
          borderRadius: '50%',
          backgroundColor: epistemic.color
        }}
      />
      {epistemic.label}
    </span>
  );
}
