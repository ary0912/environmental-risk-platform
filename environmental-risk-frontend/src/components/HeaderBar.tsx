import { useEffect, useState } from "react";
import { getSystemHealth } from "../services/api";

function HeaderBar() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    getSystemHealth()
      .then(() => setStatus("operational"))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <header className="header-main" style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          background: 'var(--primary)',
          borderRadius: '4px',
          transform: 'rotate(45deg)'
        }} />
        <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--primary)' }}>
          VULCAN <span style={{ color: 'var(--text-main)', fontWeight: 400 }}>| RISK INTELLIGENCE</span>
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Performance Metrics - Thought Machine Style */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: 'var(--primary)', opacity: 0.7 }}>LAT:</span>
            <span>14ms</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: 'var(--primary)', opacity: 0.7 }}>TPS:</span>
            <span>1.2k</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: status === 'operational' ? 'var(--primary)' : '#ef4444',
              boxShadow: status === 'operational' ? '0 0 12px var(--primary)' : '0 0 12px #ef4444'
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {status}
            </span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>v1.0.4-LATEST</span>
        </div>
      </div>
    </header>
  );
}

export default HeaderBar;