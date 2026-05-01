"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, ShieldAlert, TrendingDown, Target, BarChart2, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function CompetitorGhost() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [domain, setDomain] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysis(null);
    
    try {
      const response = await axios.post(`${apiUrl}/api/analyze_competitor`, { domain });
      setAnalysis(response.data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Ensure AI backend is online.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <Zap size={28} color="var(--accent-secondary)" />
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Competitor Ghost Engine</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Infiltrate competitor strategies and identify critical market weaknesses.</p>
      </header>

      <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
        <form onSubmit={runAnalysis} style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enter Competitor Domain</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                required 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. competitor.com" 
                className="glass-input" 
                style={{ width: '100%', paddingLeft: '48px' }} 
              />
            </div>
            <button type="submit" className="primary-button" style={{ padding: '0 40px', display: 'flex', gap: '8px', alignItems: 'center' }} disabled={loading}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Infiltrating...</> : 'Ghost Analysis'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Results Area */}
        <div className="glass-panel" style={{ padding: '32px', minHeight: '400px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="var(--accent-secondary)" /> Vulnerability Report
          </h3>

          {analysis ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analysis.weaknesses?.map((w: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                    <TrendingDown size={18} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{w}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex-center" style={{ height: '250px', opacity: 0.2, flexDirection: 'column', gap: '16px' }}>
              <Zap size={48} />
              <p>Awaiting target domain for ghost analysis...</p>
            </div>
          )}
        </div>

        {/* Strategy Area */}
        <div className="glass-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05), transparent)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} color="var(--accent-primary)" /> Counter-Strategy
          </h3>

          {analysis ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>{analysis.strategy}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Market Share</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analysis.marketShare}%</p>
                </div>
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Threat Level</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{analysis.threatLevel}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-center" style={{ height: '250px', opacity: 0.2 }}>
              <BarChart2 size={48} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
