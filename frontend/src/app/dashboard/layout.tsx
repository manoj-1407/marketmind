"use client";

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background-dark)' }}>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Topbar Component */}
        <Topbar />

        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          padding: '40px', 
          overflowY: 'auto', 
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.05), transparent 50%)' 
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
