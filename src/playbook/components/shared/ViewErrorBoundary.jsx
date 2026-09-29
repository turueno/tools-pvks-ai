// src/playbook/components/shared/ViewErrorBoundary.jsx
import React from 'react';

export class ViewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ViewErrorBoundary] Error capturado en vista:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #FCA5A5', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991B1B', margin: '0 0 8px 0' }}>
            Aviso de Renderizado en esta Sección
          </h2>
          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Hubo un problema temporal al procesar algunos campos de datos de esta vista ({this.props.viewName || 'sección actual'}).
          </p>
          <div style={{ backgroundColor: '#FEF2F2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FEE2E2', fontFamily: 'monospace', fontSize: '0.78rem', color: '#B91C1C', textAlign: 'left', marginBottom: '1.5rem', overflowX: 'auto' }}>
            {this.state.error?.message || 'Error desconocido'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔄 Reintentar Vista
            </button>
            {this.props.onNavigate && (
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onNavigate('overview');
                }}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ← Volver a Overview
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
