import { useState } from "react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  status: "success" | "warning" | "error";
  details: string;
}

const AuditTrail = () => {
  const [logs] = useState<AuditLogEntry[]>([
    { id: '1', timestamp: new Date().toISOString(), action: 'SYSTEM_BOOT', status: 'success', details: 'VULCAN Core v1.0.4 initialized.' },
    { id: '2', timestamp: new Date().toISOString(), action: 'DATA_SYNC', status: 'success', details: 'In-memory state synchronized with local buffer.' },
  ]);

  return (
    <div className="card" style={{ marginTop: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
          SYSTEM AUDIT TRAIL
        </h3>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>LIVE_TRACE_ACTIVE</div>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        maxHeight: '300px',
        paddingRight: '8px'
      }}>
        {logs.map((log) => (
          <div key={log.id} style={{
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderLeft: `2px solid ${log.status === 'success' ? 'var(--primary)' : '#ef4444'}`,
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{log.action}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{log.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTrail;
