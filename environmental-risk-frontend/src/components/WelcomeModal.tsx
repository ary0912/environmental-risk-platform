import { useState, useEffect } from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: show ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'var(--primary)',
            borderRadius: '12px',
            margin: '0 auto 20px',
            transform: 'rotate(45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ transform: 'rotate(-45deg)', color: '#000', fontWeight: '900', fontSize: '24px' }}>V</div>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
            Welcome to VULCAN
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Advanced Environmental Risk Intelligence Platform
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          <Step 
            number="01" 
            title="Target Location" 
            description="Click anywhere on the interactive map to select a geospatial target for analysis." 
          />
          <Step 
            number="02" 
            title="Configure Parameters" 
            description="Adjust environmental variables including temperature, humidity, and wind speed." 
          />
          <Step 
            number="03" 
            title="Execute Simulation" 
            description="Run the XGBoost-powered risk model and review the SHAP feature contributions." 
          />
        </div>

        <button 
          onClick={onClose}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none',
            background: 'var(--primary)',
            color: '#000',
            boxShadow: '0 0 20px var(--primary-glow)'
          }}
        >
          INITIALIZE SYSTEM
        </button>
      </div>
    </div>
  );
};

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
    <span style={{ 
      color: 'var(--primary)', 
      fontWeight: 800, 
      fontSize: '12px', 
      fontFamily: 'monospace',
      paddingTop: '3px'
    }}>{number}</span>
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{title}</h4>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{description}</p>
    </div>
  </div>
);

export default WelcomeModal;
