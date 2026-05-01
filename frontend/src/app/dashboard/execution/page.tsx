"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Plus, MoreVertical, Calendar, Clock, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  due_date: string;
}

export default function StrategyExecution() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    const title = prompt("Enter task title:");
    if (!title) return;
    const category = prompt("Enter category (e.g. Marketing, Engineering, AI/ML):") || "Strategy";
    const priority = prompt("Enter priority (high, medium, low):") || "medium";
    
    try {
      const res = await axios.post(`${apiUrl}/api/tasks`, {
        title,
        category,
        priority: priority.toLowerCase(),
        status: 'Backlog',
        due_date: new Date().toISOString().split('T')[0]
      });
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const moveTask = async (id: number, currentStatus: string) => {
    let nextStatus = "Backlog";
    if (currentStatus === "Backlog") nextStatus = "In Progress";
    else if (currentStatus === "In Progress") nextStatus = "Completed";
    else return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await axios.put(`${apiUrl}/api/tasks/${id}`, {
        ...task,
        status: nextStatus
      });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    try {
      await axios.delete(`${apiUrl}/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityStyle = (p: string) => {
    switch(p.toLowerCase()) {
      case 'high': return { color: 'var(--accent-secondary)', bg: 'rgba(244, 63, 94, 0.1)' };
      case 'medium': return { color: 'var(--accent-primary)', bg: 'rgba(139, 92, 246, 0.1)' };
      default: return { color: 'var(--accent-tertiary)', bg: 'rgba(14, 165, 233, 0.1)' };
    }
  };

  const columns = ['Backlog', 'In Progress', 'Completed'];

  return (
    <div>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <ListTodo size={28} color="var(--accent-primary)" />
            </div>
            <h1 className="heading-lg" style={{ fontSize: '2.5rem' }}>Strategy Execution</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Convert AI-generated strategies into actionable operational tasks.</p>
        </div>
        <button onClick={addTask} className="primary-button" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} /> New Strategy Task
        </button>
      </header>

      {loading ? (
        <div className="flex-center" style={{ height: '400px', color: 'var(--text-secondary)' }}>
          <Clock className="animate-spin" style={{ marginRight: '12px' }} /> Initializing Execution Pipeline...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {columns.map((column) => (
            <div key={column} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {column} <span style={{ fontSize: '0.8rem', background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {tasks.filter(t => t.status === column).length}
                  </span>
                </h3>
              </div>

              <div style={{ minHeight: '500px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed var(--glass-border)', padding: '16px' }}>
                {tasks.filter(t => t.status === column).map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel"
                    style={{ padding: '20px', marginBottom: '16px', position: 'relative' }}
                    whileHover={{ borderColor: 'var(--accent-primary)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--accent-primary)' }}>{task.category}</span>
                      <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', lineHeight: 1.4 }}>{task.title}</h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <Calendar size={12} /> {task.due_date}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        {column !== 'Completed' && (
                          <button 
                            onClick={() => moveTask(task.id, task.status)}
                            className="glass-button" 
                            style={{ padding: '4px', borderRadius: '4px' }}
                            title="Move to next stage"
                          >
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {tasks.filter(t => t.status === column).length === 0 && (
                  <div className="flex-center" style={{ height: '200px', flexDirection: 'column', opacity: 0.2, gap: '12px' }}>
                    <CheckCircle2 size={40} />
                    <p style={{ fontSize: '0.9rem' }}>Stage Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
