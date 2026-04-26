"use client";

import { motion } from 'framer-motion';
import Canvas3D from '@/components/Canvas3D';
import Link from 'next/link';
import { ArrowRight, Brain, Target, Zap, BarChart3, Globe2, Shield, Activity, ListTodo } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 3D Background */}
      <Canvas3D />

      {/* Navigation */}
      <nav style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="container">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '8px' }}>
            <Brain size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '1px' }}>
            NEXUS<span className="text-gradient">OS</span>
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/dashboard" className="glass-button">
            Command Center
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container flex-center" style={{ minHeight: '80vh', textAlign: 'center', flexDirection: 'column' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '900px', zIndex: 10 }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <span style={{ 
              padding: '8px 20px', 
              background: 'rgba(139, 92, 246, 0.15)', 
              borderRadius: '999px',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Shield size={14} /> Mission Critical Intelligence
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="heading-xl" style={{ marginBottom: '1.5rem' }}>
            The Global <span className="text-gradient">Strategy Engine</span> for High-Stakes Markets.
          </motion.h1>

          <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6, padding: '0 2rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
            Beyond AI Generation. Nexus-OS is a comprehensive Business Intelligence Operating System designed to infiltrate competitors, discover prospects, and execute campaigns with neural precision.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard">
              <button className="primary-button flex-center" style={{ gap: '12px', fontSize: '1.1rem', padding: '16px 40px' }}>
                Launch Mission Control <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/dashboard/neural">
              <button className="glass-button" style={{ padding: '16px 40px' }}>
                View Neural Roadmap
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Matrix */}
      <section className="container" style={{ padding: '6rem 24px', zIndex: 10, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid-cols-2"
        >
          <div className="glass-panel" style={{ padding: '3rem' }}>
            <Zap size={40} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 800 }}>Competitor Ghost Engine</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
              Infiltrate and analyze competitor domains in real-time. Identify pricing vulnerabilities, SEO gaps, and market positioning weaknesses before they do.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '3rem' }}>
            <Globe2 size={40} color="var(--accent-tertiary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 800 }}>Global Prospecting Radar</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
              Don't just score leads—discover them. Scan the global market by niche, revenue, and location to find your next high-value target instantly.
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '3rem' }}>
            <ListTodo size={40} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 800 }}>Strategy Execution Board</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
              Convert neural intelligence into operational reality. A built-in Kanban system that auto-populates tasks from your generated strategies.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '3rem' }}>
            <Activity size={40} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 800 }}>Neural Training Hub</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
              The roadmap to your custom LLM. Monitor data harvesting, synthetic expansion, and model fine-tuning in a dedicated, step-by-step UI.
            </p>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '3rem 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© 2026 Nexus-OS Strategic Systems. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
