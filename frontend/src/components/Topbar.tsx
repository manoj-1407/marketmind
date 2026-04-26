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
      height: '80px', 
      borderBottom: '1px solid var(--glass-border)',
      background: 'rgba(5, 5, 5, 0.4)',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
        <span>Dashboard</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentPageName === 'Dashboard' ? 'Overview' : currentPageName}</span>
      </div>

      {/* Global Search */}
      <div style={{ position: 'relative', width: '300px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Search campaigns, leads..." 
          style={{ 
            width: '100%', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '999px',
            padding: '10px 16px 10px 40px',
            color: 'white',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          className="search-input"
        />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
          <Command size={12} /> K
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--accent-secondary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-secondary)' }}></span>
        </button>
      </div>
    </header>
  );
}
