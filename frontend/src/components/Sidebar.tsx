"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, Target, Presentation, UserCheck, Settings, LogOut, ChevronRight, Zap, ListTodo, Activity, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
}

export default function Sidebar({ collapsed = false, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const SidebarContent = () => (
    <>
      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <button 
          onClick={() => setCollapsed?.(!collapsed)}
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
      )}

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '32px 24px', marginBottom: '16px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
          borderRadius: '10px', 
          padding: '10px', 
          boxShadow: '0 0 20px var(--glow-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Brain size={22} color="white" />
        </div>
        {(!collapsed || isMobile) && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', whiteSpace: 'nowrap' }}
          >
            NEXUS<span className="text-gradient">OS</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 16px' }} className="custom-scrollbar">
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', opacity: (collapsed && !isMobile) ? 0 : 1 }}>Core Engines</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
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
                  {(!collapsed || isMobile) && <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px', paddingLeft: '16px', opacity: (collapsed && !isMobile) ? 0 : 1 }}>Nexus Domain</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {nexusNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
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
                  {(!collapsed || isMobile) && <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '12px' }} className="sidebar-link">
            <Settings size={20} />
            {(!collapsed || isMobile) && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>System Config</span>}
          </div>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '12px' }} className="sidebar-link">
            <LogOut size={20} />
            {(!collapsed || isMobile) && <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Disconnect</span>}
          </div>
        </Link>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button 
          onClick={() => setMobileOpen(true)}
          style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, background: 'var(--background-light)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
        >
          <Menu size={24} />
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 101 }}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px', background: 'rgba(2, 2, 2, 0.95)', backdropFilter: 'blur(40px)', zIndex: 102, borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}
              >
                <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', right: '20px', top: '30px', color: 'var(--text-secondary)', background: 'none', border: 'none' }}>
                  <X size={24} />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ 
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(2, 2, 2, 0.9)',
        backdropFilter: 'blur(40px)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'visible'
      }}
    >
      <SidebarContent />
    </motion.aside>
  );
}
