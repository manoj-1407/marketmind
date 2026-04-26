"use client";

import { motion } from 'framer-motion';
import { Target, Presentation, UserCheck, TrendingUp, Activity, Users, Globe, Zap, ListTodo, Shield, Brain } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: '01:00', reach: 400, intent: 240 },
  { name: '04:00', reach: 300, intent: 139 },
  { name: '08:00', reach: 550, intent: 400 },
  { name: '12:00', reach: 450, intent: 390 },
  { name: '16:00', reach: 650, intent: 480 },
  { name: '20:00', reach: 900, intent: 580 },
  { name: '00:00', reach: 1100, intent: 730 },
];

export default function NexusOverview() {
  const nexusStats = [
    { name: 'Neural Intent Signal', value: '94.2%', icon: Activity, color: 'var(--accent-secondary)' },
    { name: 'Prospect Discovery', value: '1,240', icon: Globe, color: 'var(--accent-tertiary)' },
    { name: 'Ghost Infiltrations', value: '42', icon: Zap, color: 'var(--accent-primary)' },
    { name: 'System Uptime', value: '99.9%', icon: Shield, color: '#00D084' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
          <Shield size={18} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>System Secure // Nexus-v4 Online</span>
        </div>
        <h1 className="heading-lg" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '8px' }}>
          Strategic <span className="text-gradient">Mission Control</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Orchestrating global market dominance via neural intelligence.</p>
      </header>

      {/* Stats Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {nexusStats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel" 
            style={{ padding: '24px', borderLeft: `4px solid ${stat.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <stat.icon size={20} color={stat.color} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color, boxShadow: `0 0 10px ${stat.color}` }}></div>
            </div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700 }}>{stat.name}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Block */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="var(--accent-secondary)" /> Real-time Market Intent
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></div> Reach
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div> Intent
              </div>
            </div>
          </div>
          
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIntent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="reach" stroke="var(--accent-secondary)" fillOpacity={1} fill="url(#colorReach)" strokeWidth={3} />
                <Area type="monotone" dataKey="intent" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorIntent)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListTodo size={20} color="var(--accent-tertiary)" /> Critical Objectives
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { t: 'Infiltrate Competitor-X Pricing', p: 'HIGH' },
              { t: 'Train Neural Hub v2.1', p: 'MEDIUM' },
              { t: 'Architect Q3 Pitch Narrative', p: 'HIGH' },
              { t: 'Scan HealthTech Discovery Radar', p: 'LOW' }
            ].map((obj, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{obj.t}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: obj.p === 'HIGH' ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>{obj.p}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/execution">
            <button className="glass-button" style={{ width: '100%', marginTop: '24px', fontSize: '0.85rem' }}>Open Command Center</button>
          </Link>
        </div>
      </div>

      {/* Nexus Domains */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {[
          { title: 'Global Radar', href: '/dashboard/discover', desc: 'Scan markets for new leads.', icon: Globe, color: 'var(--accent-tertiary)' },
          { title: 'Ghost Engine', href: '/dashboard/competitors', desc: 'Infiltrate competitor data.', icon: Zap, color: 'var(--accent-secondary)' },
          { title: 'Neural Hub', href: '/dashboard/neural', icon: Brain, desc: 'Model training & harvesting.', color: 'var(--accent-primary)' }
        ].map((domain) => (
          <Link key={domain.title} href={domain.href} style={{ textDecoration: 'none' }}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-panel" 
              style={{ padding: '32px', height: '100%', border: '1px solid transparent', transition: 'all 0.3s ease' }}
            >
              <domain.icon size={32} color={domain.color} style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>{domain.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{domain.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
