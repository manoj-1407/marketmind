"use client";

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { UserCheck, Wand2, Loader2, Brain, CheckCircle2, Target } from 'lucide-react';
import axios from 'axios';

// Animated Ring Component
const ScoreRing = ({ score, color }: { score: number, color: string }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="var(--glass-border)"
          strokeWidth="12"
          fill="transparent"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeLinecap: 'round', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>/100</span>
      </div>
    </div>
  );
};

export default function LeadScoring() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    industry: '',
    companySize: '51-200',
    budget: '50k-100k',
    urgency: 'medium',
    source: 'website',
    engagement: 'medium'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scoreLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/api/score_lead`, formData);
      const contentStr = response.data.content;
      try {
        setResult(JSON.parse(contentStr));
      } catch (parseError) {
        setResult({ error: 'Failed to parse AI response. Ensure AI generated valid JSON.', raw: contentStr });
      }
    } catch (error) {
      console.error(error);
      setResult({ error: 'Failed to score lead. Ensure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HOT': return '#ef4444'; // Red
      case 'WARM': return '#f59e0b'; // Orange
      case 'COLD': return '#3b82f6'; // Blue
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <UserCheck size={28} color="var(--accent-tertiary)" />
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Predictive Lead Intelligence</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Identify high-intent prospects using neural qualification engines.</p>
      </header>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={scoreLead} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Firmographics</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Sarah Chen" className="glass-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Company</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Acme Corp" className="glass-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role / Title</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. VP of Sales" className="glass-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Company Size</label>
                <select name="companySize" value={formData.companySize} onChange={handleChange} className="glass-input">
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Intent Signals</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Budget Range</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="glass-input">
                  <option value="<10k">Under $10k</option>
                  <option value="10k-50k">$10k - $50k</option>
                  <option value="50k-100k">$50k - $100k</option>
                  <option value="100k-500k">$100k - $500k</option>
                  <option value="500k+">$500k+</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Purchase Urgency</label>
                <select name="urgency" value={formData.urgency} onChange={handleChange} className="glass-input">
                  <option value="low">Low (Just browsing)</option>
                  <option value="medium">Medium (Next 3-6 months)</option>
                  <option value="short">Short (Next 30-90 days)</option>
                  <option value="immediate">Immediate (Ready now)</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Engagement Level</label>
                <select name="engagement" value={formData.engagement} onChange={handleChange} className="glass-input">
                  <option value="low">Low (1-2 interactions)</option>
                  <option value="medium">Medium (Multiple visits/opens)</option>
                  <option value="high">High (Attended demo, replied)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="primary-button flex-center" style={{ width: '100%', gap: '8px', marginTop: '24px', height: '56px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={24} className="animate-pulse" /> Processing Neural Weights...
                </motion.div>
              ) : (
                <><Wand2 size={24} /> Compute Neural Score</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Output Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel" 
          style={{ padding: '40px', minHeight: '600px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
        >
          {result && !result.error && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `radial-gradient(circle at 80% 20%, ${getPriorityColor(result.priority)}20, transparent 60%)`, zIndex: 0, pointerEvents: 'none' }}></div>
          )}

          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
            <Brain size={24} color="var(--accent-tertiary)" /> 
            Live Intelligence Report
          </h2>
          
          <div style={{ flex: 1, zIndex: 10 }}>
            {result ? (
              result.error ? (
                <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <p style={{ fontWeight: 600, marginBottom: '8px' }}>Processing Error</p>
                  <p style={{ fontSize: '0.9rem' }}>{result.error}</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  
                  {/* Score Visualization */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <ScoreRing score={result.score} color={getPriorityColor(result.priority)} />
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Priority Level</p>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '12px 24px', 
                        background: `linear-gradient(90deg, ${getPriorityColor(result.priority)}20, transparent)`, 
                        border: `1px solid ${getPriorityColor(result.priority)}50`, 
                        color: getPriorityColor(result.priority), 
                        borderRadius: '12px', 
                        fontWeight: 800, 
                        fontSize: '1.5rem',
                        boxShadow: `0 0 20px ${getPriorityColor(result.priority)}20`
                      }}>
                        <CheckCircle2 size={24} /> {result.priority}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action & Reasoning */}
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
                      <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={18} color="var(--accent-tertiary)" /> Executive Recommendation
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                        {result.recommendation}
                      </p>
                    </div>
                    
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px' }}>
                      <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={18} color="var(--accent-primary)" /> Neural Reasoning
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                        {result.reasoning}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            ) : (
              <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '24px', opacity: 0.3, padding: '40px' }}>
                <Brain size={64} style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }} />
                <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>Awaiting lead firmographics for neural qualification...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
