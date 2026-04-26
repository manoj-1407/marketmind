"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, Target, Presentation, UserCheck, Settings, LogOut, ChevronRight, Search, Zap, ListTodo, Activity, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const primaryNav = [
    { name: 'Nexus Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Campaign Architect', href: '/dashboard/campaigns', icon: Target },
    { name: 'Pitch Decks', href: '/dashboard/pitches', icon: Presentation },
  ];

  const nexusNav = [
    { name: 'Lead Discovery', href: '/dashboard/discover', icon: Globe },
    { name: 'Competitor Ghost', href: '/dashboard/competitors', icon: Zap },
    { name: 'Strategy Execution', href: '/dashboard/execution', icon: ListTodo },
    { name: 'Neural Hub', href: '/dashboard/neural', icon: Activity },
  ];

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ 
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(2, 2, 2, 0.8)',
        backdropFilter: 'blur(30px)',
        position: 'relative',
        zIndex: 50,
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '32px',
          background: 'var(--accent-primary)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          zIndex: 60,
          boxShadow: '0 0 15px var(--glow-primary)'
        }}
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
          <ChevronRight size={14} />
        </motion.div>
      </button>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '32px 24px', marginBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '12px', padding: '8px', boxShadow: '0 0 20px var(--glow-primary)' }}>
          <Brain size={24} color="white" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '1px' }}>
            NEXUS<span className="text-gradient">OS</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 16px' }} className="custom-scrollbar">
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', opacity: collapsed ? 0 : 1 }}>Core Engines</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--glass-border)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }} className="sidebar-link">
                  <item.icon size={20} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                  {!collapsed && <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', opacity: collapsed ? 0 : 1 }}>Nexus Domain</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {nexusNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--glass-border)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }} className="sidebar-link">
                  <item.icon size={20} color={isActive ? 'var(--accent-secondary)' : 'currentColor'} />
                  {!collapsed && <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '12px' }} className="sidebar-link">
            <Settings size={20} />
            {!collapsed && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>System Config</span>}
          </div>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '12px' }} className="sidebar-link">
            <LogOut size={20} />
            {!collapsed && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Disconnect</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
