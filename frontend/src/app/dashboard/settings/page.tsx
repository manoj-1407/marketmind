"use client";

import { motion } from 'framer-motion';
import { Settings, Key, Bell, Shield, Database, Cpu, Globe, Sliders } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('gsk_********************************');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
            <Settings size={28} color="var(--accent-primary)" />
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Platform Settings</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Configure your AI engine and system preferences.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px', alignItems: 'start' }}>
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.4)', textAlign: 'left', cursor: 'pointer', color: 'white', borderRadius: '16px' }}>
            <Key size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 600 }}>API Configuration</span>
          </button>
          
          <button className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)', border: '1px solid transparent', borderRadius: '16px' }}>
            <Database size={20} />
            <span style={{ fontWeight: 600 }}>Data & Memory</span>
          </button>

          <button className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)', border: '1px solid transparent', borderRadius: '16px' }}>
            <Bell size={20} />
            <span style={{ fontWeight: 600 }}>Notifications</span>
          </button>

          <button className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: 'var(--text-secondary)', border: '1px solid transparent', borderRadius: '16px' }}>
            <Shield size={20} />
            <span style={{ fontWeight: 600 }}>Security & Team</span>
          </button>
        </div>

        {/* Settings Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="form-card" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
              <Cpu size={24} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                Groq Neural Engine Configuration
              </h2>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <Key size={16} /> Groq API Key (LLaMA-3 70B)
                </label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="glass-input" 
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                />
                <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  This key is used to generate campaigns, pitches, and score leads. It is currently set via the <code style={{ color: 'var(--accent-secondary)' }}>.env</code> file but can be overridden for this session.
                </p>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <Globe size={16} /> Preferred AI Model
                </label>
                <select className="glass-input" defaultValue="llama3-70b-8192" style={{ appearance: 'none' }}>
                  <option value="llama3-70b-8192">LLaMA 3 70B (Recommended - High Reasoning)</option>
                  <option value="llama3-8b-8192">LLaMA 3 8B (Faster - Lower Latency)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B (Large Context Window)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <Sliders size={16} /> Creativity Temperature
                </label>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <input type="range" min="0" max="100" defaultValue="75" style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '12px' }}>
                    <span>Logical & Precise (0)</span>
                    <span>Highly Creative (1.0)</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                <button type="submit" className="primary-button" style={{ padding: '14px 32px' }}>
                  Save Configuration
                </button>
                {saved && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: '#00D084', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D084', boxShadow: '0 0 10px #00D084' }} />
                    Settings saved successfully!
                  </motion.span>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
