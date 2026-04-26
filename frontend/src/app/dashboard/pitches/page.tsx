"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Presentation, Wand2, Loader2, Brain, Download } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

export default function PitchGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    problem: '',
    solution: '',
    fundingStage: 'seed',
    amountSeeking: '',
    valuation: '',
    teamSize: '',
    revenue: '',
    customers: '',
    growthRate: '',
    burnRate: '',
    marketSize: '',
    competitors: '',
    advantage: '',
    businessModel: 'subscription',
    pricing: '',
    includeFinancials: true,
    includeRoadmap: true,
    includeTeam: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const generatePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/generate_pitch', formData);
      setResult(response.data.content);
    } catch (error) {
      console.error(error);
      setResult('Failed to generate pitch deck. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('markdown-output');
    if (element) {
      const opt = {
        margin:       1,
        filename:     `${formData.product.replace(/\s+/g, '_')}_Pitch_Deck.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Presentation size={32} color="var(--accent-secondary)" />
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Pitch Deck Architect</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Craft venture-capital-ready narratives and secure funding.</p>
      </header>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={generatePitch} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Company Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Company Name</label>
                <input required type="text" name="product" value={formData.product} onChange={handleChange} placeholder="e.g. Acme Corp" className="glass-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Funding Stage</label>
                <select name="fundingStage" value={formData.fundingStage} onChange={handleChange} className="glass-input">
                  <option value="pre-seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series_a">Series A</option>
                  <option value="series_b">Series B+</option>
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>The Narrative</h3>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>The Problem</label>
              <textarea required name="problem" value={formData.problem} onChange={handleChange} placeholder="What pain are you solving?" className="glass-input glass-textarea" style={{ minHeight: '60px' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>The Solution</label>
              <textarea required name="solution" value={formData.solution} onChange={handleChange} placeholder="How does your product solve it?" className="glass-input glass-textarea" style={{ minHeight: '60px' }} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Traction & Ask</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Amount Seeking ($)</label>
                <input type="text" name="amountSeeking" value={formData.amountSeeking} onChange={handleChange} placeholder="e.g. $2M" className="glass-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current MRR / Revenue</label>
                <input type="text" name="revenue" value={formData.revenue} onChange={handleChange} placeholder="e.g. $50k MRR" className="glass-input" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input type="checkbox" name="includeFinancials" checked={formData.includeFinancials} onChange={handleChange} style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }} />
                <span>Include 3-Year Financial Projections</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input type="checkbox" name="includeRoadmap" checked={formData.includeRoadmap} onChange={handleChange} style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }} />
                <span>Include 12-Month Product Roadmap</span>
              </label>
            </div>

            <button type="submit" className="primary-button flex-center" style={{ width: '100%', gap: '8px', marginTop: '24px', height: '56px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={24} className="animate-pulse" /> Architecting Deck...
                </motion.div>
              ) : (
                <><Wand2 size={24} /> Generate Pitch Deck</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Output Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel" 
          style={{ padding: '32px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Presentation size={20} color="var(--accent-secondary)" /> Generated Pitch Deck
            </h2>
            {result && (
              <button onClick={downloadPDF} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Download size={16} /> Export PDF
              </button>
            )}
          </div>
          
          <div style={{ 
            flex: 1, 
            background: 'rgba(0,0,0,0.2)', 
            borderRadius: '8px', 
            padding: '24px',
            border: '1px inset var(--glass-border)',
            overflowY: 'auto',
            maxHeight: '700px',
            color: result ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}>
            {result ? (
              <div id="markdown-output" style={{ padding: '24px' }} className="markdown-content">
                <ReactMarkdown>
                  {result}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '16px', opacity: 0.5 }}>
                <Brain size={48} />
                <p>Awaiting parameters to construct venture-ready narrative...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
