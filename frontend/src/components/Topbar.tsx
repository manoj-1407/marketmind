"use client";

import { Bell, Search, Command } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname();
  
  // Format pathname for breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPageName = pathSegments[pathSegments.length - 1] 
    ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
    : 'Overview';

  return (
    <header style={{ 
      height: '90px', 
      borderBottom: '1px solid var(--glass-border)',
      background: 'rgba(2, 2, 2, 0.4)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
        <span style={{ fontWeight: 500 }}>Dashboard</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{currentPageName === 'Dashboard' ? 'Overview' : currentPageName}</span>
      </div>

      {/* Global Search */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
        <input 
          type="text" 
          placeholder="Search campaigns, leads..." 
          style={{ 
            width: '100%', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '12px',
            padding: '12px 16px 12px 48px',
            color: 'white',
            outline: 'none',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          className="search-input"
        />
        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
          <Command size={12} /> K
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', position: 'relative', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' }} className="sidebar-link">
          <Bell size={22} />
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', background: 'var(--accent-secondary)', borderRadius: '50%', border: '2px solid var(--background-dark)', boxShadow: '0 0 10px var(--accent-secondary)' }}></span>
        </button>
      </div>
    </header>
  );
}
