"use client";

import { motion } from 'framer-motion';
import Canvas3D from '@/components/Canvas3D';
import Link from 'next/link';
import { ArrowRight, Brain, Target, Zap, BarChart3, Globe2 } from 'lucide-react';

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
    <main style={{ position: 'relative', minHeight: '100vh' }}>
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
          <Brain size={32} color="var(--accent-primary)" />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Market<span className="text-gradient">Mind</span>
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/dashboard" className="glass-button">
            Launch Platform
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container flex-center" style={{ minHeight: '80vh', textAlign: 'center', flexDirection: 'column' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '800px', zIndex: 10 }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <span style={{ 
              padding: '8px 16px', 
              background: 'rgba(124, 58, 237, 0.1)', 
              borderRadius: '999px',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Zap size={14} /> Next-Gen AI Strategy Engine
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="heading-xl" style={{ marginBottom: '1.5rem' }}>
            Your <span className="text-gradient-accent">AI Co-Founder</span> For Unfair Market Advantage.
          </motion.h1>

          <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6, padding: '0 2rem' }}>
            Transform weeks of strategic planning into seconds. Generate award-winning campaigns, investor-grade pitches, and predictive lead scoring with a single click.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link href="/dashboard">
              <button className="primary-button flex-center" style={{ gap: '8px', fontSize: '1.1rem' }}>
                Start Building Free <ArrowRight size={20} />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: '6rem 24px', zIndex: 10, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid-cols-2"
        >
          <div className="glass-panel" style={{ padding: '3rem' }}>
            <Target size={40} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>Viral Campaign Architect</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
              Stop guessing what works. Our AI analyzes millions of data points to architect psychological, high-converting marketing campaigns tailored to your exact audience.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '3rem' }}>
            <BarChart3 size={40} color="var(--accent-tertiary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>Predictive Lead Scoring</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
              Identify your hottest prospects instantly. Our proprietary neural engine scores leads based on firmographics, behavior, and hidden market intent signals.
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '3rem', gridColumn: '1 / -1' }}>
            <Globe2 size={40} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>Investor-Grade Pitch Generator</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem', maxWidth: '800px' }}>
              Raising capital? We generate the exact narratives that venture capitalists fund. From problem-agitation to TAM calculations and financial projections, we build your deck's skeleton in 14 seconds.
            </p>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '3rem 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© 2026 MarketMind Technologies. The Future of AI Strategy.</p>
      </footer>
    </main>
  );
}
