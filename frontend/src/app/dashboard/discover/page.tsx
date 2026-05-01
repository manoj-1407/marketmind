"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Filter, MapPin, Building2, UserPlus, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ProspectingRadar() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const searchLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    
    try {
      const response = await axios.post(`${apiUrl}/api/prospect_radar`, { query });
      setResults(response.data.leads || []);
    } catch (error) {
      console.error(error);
      alert("Radar scan failed. Ensure AI backend is online.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
            <Globe size={28} color="var(--accent-tertiary)" />
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Prospecting Radar</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Scan the global market to discover high-value targets matching your ideal customer profile.</p>
      </header>

      {/* Search Header */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <form onSubmit={searchLeads} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              required 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. B2B SaaS companies in California with Series A funding" 
              className="glass-input" 
              style={{ width: '100%', paddingLeft: '52px' }} 
            />
          </div>
          <button type="submit" className="primary-button" style={{ padding: '0 32px', display: 'flex', gap: '8px', alignItems: 'center' }} disabled={loading}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Scanning Global Data...</> : 'Run Radar Scan'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 3' }}>
          {results.length > 0 ? results.map((lead, i) => (
            <motion.div 
              key={lead.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel"
              style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={24} color="var(--accent-tertiary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{lead.name}</h4>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {lead.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{lead.industry}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{lead.contact}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Revenue: {lead.revenue}</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Mail size={14} /> Contact
                  </button>
                  <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center', borderColor: 'var(--accent-tertiary)' }}>
                    <UserPlus size={14} /> Add to Scoring
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '20px', opacity: 0.3 }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <Globe size={64} className="animate-spin" />
                  <p style={{ fontSize: '1.2rem' }}>Pulsing Market Radar...</p>
                </div>
              ) : (
                <>
                  <Globe size={64} />
                  <p style={{ fontSize: '1.2rem' }}>Initiate a scan to discover global opportunities.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
