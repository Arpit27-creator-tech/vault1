import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './compiled.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[VAULT CRITICAL] React Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
    try {
      localStorage.setItem('vault_last_crash', JSON.stringify({
        message: error?.message || String(error),
        stack: error?.stack || '',
        componentStack: errorInfo?.componentStack || '',
        time: new Date().toISOString()
      }));
    } catch (_) {}
  }

  handleCopyError = () => {
    const errorDetails = `[VAULT CRASH DIAGNOSTIC]\nMessage: ${this.state.error?.message}\n\nStack:\n${this.state.error?.stack || 'No stack'}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || 'No component stack'}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(errorDetails).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2500);
      }).catch(() => {});
    }
  };

  handleSafeRecovery = () => {
    try {
      localStorage.removeItem('vault_current_user');
      localStorage.removeItem('vault_tour_seen_v3');
    } catch (_) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#051811',
          color: '#F0FDF4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            backgroundColor: '#072418',
            border: '3px solid #10B981',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
          }}>
            <h1 style={{ color: '#F59E0B', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>
              🛡️ TERMINAL RECOVERY ENGAGED
            </h1>
            <p style={{ color: '#A7F3D0', fontSize: '13px', marginBottom: '16px' }}>
              An interface anomaly was intercepted by the Syndicate security protocol.
            </p>
            <div style={{
              backgroundColor: '#020B06',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#FF6B8B',
              marginBottom: '20px',
              overflowX: 'auto',
              maxHeight: '220px',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              userSelect: 'text'
            }}>
              <div style={{ color: '#FCA5A5', fontWeight: 'bold', marginBottom: '6px' }}>
                Anomaly: {this.state.error?.message || 'Unknown runtime anomaly'}
              </div>
              {this.state.error?.stack || 'No detailed stack trace available.'}
              {this.state.errorInfo?.componentStack && (
                <div style={{ marginTop: '10px', color: '#93C5FD' }}>
                  Component Stack:
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleCopyError}
                style={{
                  backgroundColor: this.state.copied ? '#059669' : '#042F2E',
                  color: '#A7F3D0',
                  border: '1px solid #10B981',
                  fontWeight: 'bold',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}
              >
                {this.state.copied ? '✓ Diagnostics Copied!' : '📋 Copy Error Details'}
              </button>
              <button
                onClick={this.handleSafeRecovery}
                style={{
                  backgroundColor: '#10B981',
                  color: '#02140D',
                  fontWeight: 'bold',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}
              >
                Safe Recover HUD
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                style={{
                  backgroundColor: '#051C12',
                  color: '#F59E0B',
                  border: '1px solid #F59E0B',
                  fontWeight: 'bold',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}
              >
                Reset All Storage
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register PWA service worker for mobile caching and standalone support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('[VAULT PWA] ServiceWorker registered successfully with scope:', registration.scope);
      },
      (err) => {
        console.warn('[VAULT PWA] ServiceWorker registration skipped:', err);
      }
    );
  });
}

