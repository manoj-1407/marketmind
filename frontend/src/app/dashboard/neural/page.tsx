"use client";

import { motion } from 'framer-motion';
import { Activity, Database, Cpu, ShieldCheck, Zap, ArrowRight, BarChart, Server } from 'lucide-react';

export default function NeuralHub() {
  const pipelineSteps = [
    { 
      title: 'Data Ingestion', 
      desc: 'Scraping competitor domains, market reports, and strategy documents.',
      icon: Database,
      status: 'Collecting',
      progress: 65,
      color: 'var(--accent-tertiary)'
    },
    { 
      title: 'Neural Cleaning', 
      desc: 'Removing noise and formatting strategic data into Instruct-Tuning pairs.',
      icon: Zap,
      status: 'Active',
      progress: 40,
      color: 'var(--accent-primary)'
    },
    { 
      title: 'Synthetic Expansion', 
      desc: 'Generating 100k+ high-fidelity business scenarios via LLaMA-3 Teacher.',
      icon: Cpu,
      status: 'Pending',
      progress: 0,
      color: 'var(--accent-secondary)'
    },
    { 
      title: 'PEFT Fine-Tuning', 
      desc: 'Training the custom MarketMind-V2 weights using LoRA on private servers.',
      icon: Server,
      status: 'Locked',
      progress: 0,
      color: 'var(--text-secondary)'
    }
  ];

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <Activity size={28} color="var(--accent-secondary)" />
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Neural Training Hub</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Monitor the development and data harvesting of your custom MarketMind-V2 model.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        {/* Pipeline Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {pipelineSteps.map((step, i) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel"
              style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ padding: '16px', background: `${step.color}15`, borderRadius: '12px', border: `1px solid ${step.color}30` }}>
                  <step.icon size={24} color={step.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{step.title}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: step.color }}>{step.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>{step.desc}</p>
                  
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', position: 'relative' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      style={{ height: '100%', background: step.color, borderRadius: '99px', boxShadow: `0 0 10px ${step.color}` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Training Stats & Roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart size={20} /> Dataset Health
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Raw Samples</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>142,842</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Gold Labels</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>12,401</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Loss Variance</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>0.024</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Model Version</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>v0.6-Beta</p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--accent-secondary)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-secondary)' }}>Proprietary Advantage</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              We are moving towards a patentable **Neural Strategy Weighting** system. This allows MarketMind to predict market outcomes without relying on generic LLM logic.
            </p>
            <button className="primary-button" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              Request Model Deployment <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
