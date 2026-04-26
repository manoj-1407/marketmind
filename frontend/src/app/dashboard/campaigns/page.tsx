"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Wand2, ArrowRight, Loader2, Brain, Download } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

export default function CampaignGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    tone: 'professional',
    objective: 'leads',
    budget: '10000-25000',
    platforms: 'Google Ads, LinkedIn'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    
    try {
      // Connects to the FastAPI Backend
      const response = await axios.post('http://127.0.0.1:8000/api/generate_campaign', formData);
      setResult(response.data.content);
    } catch (error) {
      console.error(error);
      setResult('Failed to generate campaign. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('markdown-output');
    if (element) {
      const opt = {
        margin:       1,
        filename:     `${formData.product.replace(/\s+/g, '_')}_Campaign.pdf`,
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
          <Target size={32} color="var(--accent-primary)" />
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Campaign Architect</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Generate award-winning marketing strategies in seconds.</p>
      </header>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={generateCampaign} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Campaign Parameters</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product / Service Name</label>
              <input required type="text" name="product" value={formData.product} onChange={handleChange} placeholder="e.g. MarketMind Enterprise" className="glass-input" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Audience</label>
              <textarea required name="audience" value={formData.audience} onChange={handleChange} placeholder="e.g. CMOs at B2B SaaS companies with $10M+ ARR" className="glass-input glass-textarea" style={{ minHeight: '80px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Brand Tone</label>
                <select name="tone" value={formData.tone} onChange={handleChange} className="glass-input">
                  <option value="professional">Professional & Trustworthy</option>
                  <option value="aggressive">Aggressive & Disruptive</option>
                  <option value="casual">Casual & Conversational</option>
                  <option value="luxury">Luxury & Premium</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Campaign Objective</label>
                <select name="objective" value={formData.objective} onChange={handleChange} className="glass-input">
                  <option value="leads">Lead Generation</option>
                  <option value="awareness">Brand Awareness</option>
                  <option value="sales">Direct Sales</option>
                </select>
              </div>
            </div>

            <button type="submit" className="primary-button flex-center" style={{ width: '100%', gap: '8px', marginTop: '24px', height: '56px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={24} className="animate-pulse" /> Architecting Strategy...
                </motion.div>
              ) : (
                <><Wand2 size={24} /> Generate Campaign</>
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
              <Target size={20} color="var(--accent-secondary)" /> Generated Strategy
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
                <p>Awaiting parameters to construct neural marketing pathways...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
