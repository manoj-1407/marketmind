"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, Target, Presentation, UserCheck, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Campaign Architect', href: '/dashboard/campaigns', icon: Target },
    { name: 'Pitch Decks', href: '/dashboard/pitches', icon: Presentation },
    { name: 'Lead Intelligence', href: '/dashboard/leads', icon: UserCheck },
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
        background: 'rgba(5, 5, 5, 0.6)',
        backdropFilter: 'blur(20px)',
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
          boxShadow: '0 0 10px var(--glow-primary)'
        }}
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
          <ChevronRight size={14} />
        </motion.div>
      </button>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '32px 24px', marginBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '12px', padding: '8px', boxShadow: '0 0 15px var(--glow-primary)' }}>
          <Brain size={24} color="white" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: '1.25rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            Market<span className="text-gradient">Mind</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, padding: '0 16px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? 'linear-gradient(90deg, rgba(124, 58, 237, 0.15), transparent)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }} className="sidebar-link">
                <item.icon size={22} color={isActive ? 'var(--accent-primary)' : 'currentColor'} style={{ minWidth: '22px' }} />
                {!collapsed && (
                  <span style={{ fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{item.name}</span>
                )}
                {isActive && (
                  <motion.div layoutId="active-indicator" style={{ position: 'absolute', left: -3, top: 0, bottom: 0, width: 3, background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', color: pathname === '/dashboard/settings' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderRadius: '12px', transition: 'all 0.2s ease' }} className="sidebar-link">
            <Settings size={22} />
            {!collapsed && <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Settings</span>}
          </div>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '12px', transition: 'all 0.2s ease' }} className="sidebar-link">
            <LogOut size={22} />
            {!collapsed && <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Exit</span>}
          </div>
        </Link>
      </div>
      
      {/* User Profile */}
      {!collapsed && (
        <div style={{ padding: '16px', margin: '0 16px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            ST
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Strategist</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Pro Plan</p>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
