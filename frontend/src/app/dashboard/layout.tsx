"use client";

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`dashboard-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Component */}
      <Sidebar collapsed={isCollapsed} setCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="dashboard-main" style={{ marginLeft: isCollapsed ? '80px' : '280px' }}>
        {/* Topbar Component */}
        <Topbar />

        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          padding: '40px', 
          overflowY: 'auto', 
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.05), transparent 50%)' 
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '1400px', margin: '0 auto' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
