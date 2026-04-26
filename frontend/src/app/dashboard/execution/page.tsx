"use client";

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ListTodo, Plus, MoreVertical, Calendar, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Optimize Landing Page Copy for LLaMA-3 conversion', category: 'Marketing', priority: 'high', dueDate: '2026-05-01' },
  { id: '2', title: 'Integrate Web Scraper for Competitor Pricing', category: 'Engineering', priority: 'high', dueDate: '2026-04-28' },
  { id: '3', title: 'Schedule VC Intro Call for Series A', category: 'Operations', priority: 'medium', dueDate: '2026-05-15' },
  { id: '4', title: 'Refine Neural Weights for Lead Scoring', category: 'AI/ML', priority: 'low', dueDate: '2026-06-01' },
];

export default function StrategyExecution() {
  const [tasks, setTasks] = useState(initialTasks);

  const getPriorityStyle = (p: string) => {
    switch(p) {
      case 'high': return { color: 'var(--accent-secondary)', bg: 'rgba(244, 63, 94, 0.1)' };
      case 'medium': return { color: 'var(--accent-primary)', bg: 'rgba(139, 92, 246, 0.1)' };
      default: return { color: 'var(--accent-tertiary)', bg: 'rgba(14, 165, 233, 0.1)' };
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <ListTodo size={28} color="var(--accent-primary)" />
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Strategy Execution</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Convert AI-generated strategies into actionable operational tasks.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        {/* Kanban Columns */}
        {['Backlog', 'In Progress', 'Completed'].map((column, colIdx) => (
          <div key={column} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {column} <span style={{ fontSize: '0.8rem', background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{colIdx === 0 ? tasks.length : 0}</span>
              </h3>
              <Plus size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
            </div>

            <div style={{ minHeight: '500px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed var(--glass-border)', padding: '16px' }}>
              {colIdx === 0 && tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  layoutId={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel"
                  style={{ padding: '20px', marginBottom: '16px', cursor: 'grab' }}
                  whileHover={{ scale: 1.02, borderColor: 'var(--accent-primary)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--accent-primary)' }}>{task.category}</span>
                    <MoreVertical size={14} color="var(--text-secondary)" />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', lineHeight: 1.4 }}>{task.title}</h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={12} /> {task.dueDate}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase',
                      background: getPriorityStyle(task.priority).bg,
                      color: getPriorityStyle(task.priority).color
                    }}>
                      {task.priority}
                    </div>
                  </div>
                </motion.div>
              ))}

              {colIdx > 0 && (
                <div className="flex-center" style={{ height: '100%', flexDirection: 'column', opacity: 0.2, gap: '12px' }}>
                  <Clock size={48} />
                  <p>Drag tasks here to update</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
