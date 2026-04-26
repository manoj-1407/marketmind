"use client";

import { motion } from 'framer-motion';
import { Target, Presentation, UserCheck, TrendingUp, Activity, Users } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', leads: 400, campaigns: 240, amt: 2400 },
  { name: 'Tue', leads: 300, campaigns: 139, amt: 2210 },
  { name: 'Wed', leads: 550, campaigns: 400, amt: 2290 },
  { name: 'Thu', leads: 450, campaigns: 390, amt: 2000 },
  { name: 'Fri', leads: 650, campaigns: 480, amt: 2181 },
  { name: 'Sat', leads: 700, campaigns: 380, amt: 2500 },
  { name: 'Sun', leads: 900, campaigns: 430, amt: 2100 },
];

export default function DashboardOverview() {
  const stats = [
    { name: 'Active Campaigns', value: '12', icon: Target, color: 'var(--accent-primary)', change: '+20%' },
    { name: 'Decks Generated', value: '48', icon: Presentation, color: 'var(--accent-secondary)', change: '+15%' },
    { name: 'Leads Scored', value: '2,847', icon: UserCheck, color: 'var(--accent-tertiary)', change: '+34%' },
  ];

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="heading-lg" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Welcome back, <span className="text-gradient-accent">Strategist</span>.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Here's what your AI Co-Founder has been analyzing today.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel" 
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: stat.color, filter: 'blur(50px)', opacity: 0.2, borderRadius: '50%' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: `0 0 15px ${stat.color}40` }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <span style={{ color: '#00D084', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 208, 132, 0.1)', padding: '4px 8px', borderRadius: '999px' }}>
                <TrendingUp size={16} /> {stat.change}
              </span>
            </div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '8px', fontWeight: 500 }}>{stat.name}</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Activity size={24} color="var(--accent-tertiary)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Neural Engagement Activity</h2>
        </div>
        
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-tertiary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-tertiary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCampaigns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                itemStyle={{ color: 'white' }}
              />
              <Area type="monotone" dataKey="leads" stroke="var(--accent-tertiary)" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
              <Area type="monotone" dataKey="campaigns" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorCampaigns)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <Link href="/dashboard/campaigns">
            <div className="glass-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: '16px', height: '100%', background: 'rgba(124, 58, 237, 0.05)' }}>
              <Target size={32} color="var(--accent-primary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Architect New Campaign</span>
            </div>
          </Link>

          <Link href="/dashboard/pitches">
            <div className="glass-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: '16px', height: '100%', background: 'rgba(236, 72, 153, 0.05)' }}>
              <Presentation size={32} color="var(--accent-secondary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Generate Pitch Deck</span>
            </div>
          </Link>

          <Link href="/dashboard/leads">
            <div className="glass-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: '16px', height: '100%', background: 'rgba(6, 182, 212, 0.05)' }}>
              <UserCheck size={32} color="var(--accent-tertiary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Score Inbound Leads</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
