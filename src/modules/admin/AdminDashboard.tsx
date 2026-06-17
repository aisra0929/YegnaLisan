/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, UserRole, RequestStatus, TranslationRequest, FreelancerApplication, FeedbackSubmission, FileType } from '../../types';
import { translations, LanType } from '../../lib/translations';
import { 
  ShieldCheck, LayoutDashboard, Briefcase, FileCheck, Users, MessageSquare, 
  Menu, X, LogOut, Globe, Plus, ToggleLeft, ToggleRight, Check, AlertCircle, ArrowUpRight,
  Lock, Key, UserPlus, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  activeLanguage: LanType;
  activeTheme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

export default function AdminDashboard({ 
  user, 
  onLogout,
  activeLanguage,
  activeTheme,
  toggleTheme,
  toggleLanguage
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'applications' | 'users' | 'feedback' | 'add-user'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Back-end Synchronized States
  const [requests, setRequests] = useState<TranslationRequest[]>([]);
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Admin Manual User Creation Form States
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    fullName: '',
    role: UserRole.FREELANCER,
    phone: '',
    password: 'tempPassword123',
    isTemporary: true,
    companyName: '',
    languages: 'Amharic, English, French',
    experienceYears: '3',
    department: 'Translation Ops',
    languageSpecialization: 'English / Amharic',
    accessLevel: 'Standard Admin'
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);

  // User details modification states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    languages: '',
    experienceYears: '',
    department: '',
    languageSpecialization: '',
    accessLevel: ''
  });
  const [editUserSuccess, setEditUserSuccess] = useState<string | null>(null);

  // Password reset prompt states
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<string | null>(null);
  
  // Modal / Input states
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    sourceLanguage: 'English',
    targetLanguage: 'Amharic',
    wordCount: 500,
    urgency: 'Standard' as 'Standard' | 'Urgent' | 'Express',
    dialect: 'Standard Dialect',
    price: 1500,
    isConfidential: false
  });
  
  const [feedReplies, setFeedReplies] = useState<Record<string, string>>({});
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);

  const t = translations[activeLanguage];

  // Fetch all database records
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [reqResp, appResp, usersResp, feedResp] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/freelancers/applications'),
        fetch('/api/users'),
        fetch('/api/feedback')
      ]);

      if (reqResp.ok) setRequests(await reqResp.json());
      if (appResp.ok) setApplications(await appResp.json());
      if (usersResp.ok) setUsersList(await usersResp.json());
      if (feedResp.ok) setFeedbacks(await feedResp.json());
    } catch (e) {
      console.error("Failed to load admin workspace database nodes", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update user profile status (Activate/Deactivate)
  const handleToggleUserStatus = async (usr: User) => {
    const nextStatus = usr.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const resp = await fetch(`/api/users/${usr.id}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (resp.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  // Onboard applicant approve or reject
  const handleOnboardApp = async (appId: string, status: 'Approved' | 'Rejected') => {
    try {
      const resp = await fetch(`/api/freelancers/applications/${appId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (resp.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Accept or reject posted job deliveries
  const handleUpdateJobStatus = async (jobId: string, status: RequestStatus) => {
    try {
      const resp = await fetch(`/api/requests/${jobId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (resp.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Post New Job (Admin Action)
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id,
          clientName: user.fullName,
          title: newJob.title,
          description: newJob.description,
          sourceLanguage: newJob.sourceLanguage,
          targetLanguage: newJob.targetLanguage,
          fileType: FileType.DOCUMENT,
          wordCount: newJob.wordCount,
          urgency: newJob.urgency,
          dialect: newJob.dialect,
          isConfidential: newJob.isConfidential
        })
      });

      if (resp.ok) {
        setShowAddJob(false);
        setNewJob({
          title: '',
          description: '',
          sourceLanguage: 'English',
          targetLanguage: 'Amharic',
          wordCount: 500,
          urgency: 'Standard',
          dialect: 'Standard Dialect',
          price: 1500,
          isConfidential: false
        });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const submitFeedbackReply = (feedbackId: string) => {
    const text = feedReplies[feedbackId];
    if (!text) return;
    setReplySuccessMsg(`Reply dispatched successfully to client for review: "${text}"`);
    setFeedReplies(prev => ({ ...prev, [feedbackId]: '' }));
    setTimeout(() => setReplySuccessMsg(null), 4500);
  };

  // Admin manually creates users
  const handleAdminCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setAddUserSuccess(null);
    setSubmitting(true);
    try {
      const resp = await fetch('/api/users/admin-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm)
      });
      const data = await resp.json();
      if (!resp.ok) {
        setAddUserError(data.error || 'Failed to manually configure user accounts.');
      } else {
        setAddUserSuccess(data.message || 'Ecosystem account successfully generated!');
        setNewUserForm({
          email: '',
          fullName: '',
          role: UserRole.FREELANCER,
          phone: '',
          password: 'tempPassword123',
          isTemporary: true,
          companyName: '',
          languages: 'Amharic, English, French',
          experienceYears: '3',
          department: 'Translation Ops',
          languageSpecialization: 'English / Amharic',
          accessLevel: 'Standard Admin'
        });
        fetchAllData();
      }
    } catch (err) {
      setAddUserError('Network protocol failure.');
    } finally {
      setSubmitting(false);
    }
  };

  // Start editor view for user details
  const startEditingUser = (usr: User) => {
    setEditingUserId(usr.id);
    setEditUserForm({
      fullName: usr.fullName || '',
      email: usr.email || '',
      phone: usr.phone || '',
      companyName: (usr as any).companyName || '',
      languages: (usr as any).dialectSpecializations?.join(', ') || '',
      experienceYears: String((usr as any).experienceYears || '0'),
      department: (usr as any).department || 'Translation Ops',
      languageSpecialization: (usr as any).languageSpecialization || 'English / Amharic',
      accessLevel: (usr as any).accessLevel || 'Standard Admin'
    });
    setEditUserSuccess(null);
  };

  // Submit profile edits
  const handleAdminUpdateUserSubmit = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    setEditUserSuccess(null);
    try {
      const resp = await fetch(`/api/users/${userId}/admin-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUserForm)
      });
      const data = await resp.json();
      if (resp.ok) {
        setEditUserSuccess('Ecosystem credentials successfully updated!');
        setEditingUserId(null);
        fetchAllData();
      } else {
        alert(data.error || 'Failed updating specialized credentials.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit manual password reset
  const handleAdminResetPasswordSubmit = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    setPasswordResetSuccess(null);
    if (!newPasswordInput) return;
    try {
      const resp = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordInput })
      });
      const data = await resp.json();
      if (resp.ok) {
        setPasswordResetSuccess(data.message || 'Password successfully refreshed.');
        setResettingUserId(null);
        setNewPasswordInput('');
        fetchAllData();
      } else {
        alert(data.error || 'Failed password reset operation.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPIs
  const activeJobsCount = requests.filter(r => r.status !== RequestStatus.COMPLETED && r.status !== RequestStatus.ARCHIVED).length;
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;
  const activeUsersCount = usersList.filter(u => u.status === 'Active').length;
  
  // Calculate total price of completed and in progress jobs as dynamic revenue
  const monthlyRevenue = requests.reduce((total, r) => total + (r.price || 0), 0);

  // Self-drawing clean SVG Line-chart coordinates
  const points = "0,150 50,130 100,105 155,115 210,80 265,55 320,70 375,40 430,30 480,10";

  return (
    <div className="h-screen bg-[#070b19] font-sans text-slate-200 flex overflow-hidden">
      
      {/* LEFT SIDEBAR (Collapsible) */}
      <div className={`flex-shrink-0 bg-[#0f172a] border-r border-blue-500/10 transition-all duration-300 flex flex-col h-screen overflow-y-auto ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-blue-500/10">
          <div className="p-1.5 rounded-xl bg-blue-600 border border-white/10 shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div>
              <p className="text-xs font-black tracking-wider text-white uppercase">Yegna Lisan</p>
              <p className="text-[9px] font-bold text-blue-400 tracking-tight uppercase">Admin Console</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'applications', label: 'Applications', icon: FileCheck },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'add-user', label: 'Add User', icon: UserPlus },
            { id: 'feedback', label: 'Feedback', icon: MessageSquare }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/15 border-l-4 border-blue-500 text-blue-400 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* User Card at bottom */}
        {isSidebarOpen && (
          <div className="p-4 m-4 rounded-xl bg-slate-900/60 border border-blue-500/5 text-center">
            <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-mono">Platform Admin</p>
          </div>
        )}
      </div>

      {/* RIGHT WORKSPACE PANELS */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-[#0f172a] border-b border-blue-500/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-850 border border-blue-500/10 text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {activeTab === 'dashboard' ? 'Platform Overview' : `${activeTab.toUpperCase()} PANEL`}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="p-1.5 px-3 rounded-lg bg-rose-600/15 border border-rose-500/20 text-[10px] text-rose-400 hover:bg-rose-600 hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </header>

        {/* Main Content Scroll container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                <p className="text-xs text-slate-400 font-mono">Synchronizing state ledger...</p>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* TAB 1: DASHBOARD OVERVIEW */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                      {[
                        { title: 'Active Jobs', value: activeJobsCount, subtitle: 'Currently in translation cycle', color: 'text-blue-400' },
                        { title: 'Pending Applications', value: pendingAppsCount, subtitle: 'Linguists in onboarding queue', color: 'text-indigo-400' },
                        { title: 'Registered Users', value: activeUsersCount, subtitle: 'Fully activated system accounts', color: 'text-emerald-400' },
                        { title: 'Fiscal Volume (Est)', value: `ETB ${monthlyRevenue.toLocaleString()}`, subtitle: 'Aggregated escrow values', color: 'text-amber-500' }
                      ].map((card, idx) => (
                        <div key={idx} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl shadow-md">
                          <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{card.title}</p>
                          <p className={`text-2xl font-black font-mono mt-1 ${card.color}`}>{card.value}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{card.subtitle}</p>
                        </div>
                      ))}
                    </div>

                    {/* Highly Crafted LOAD-ANIMATED SVG Dashboard Line Chart & Progress Bars */}
                    <div className="bg-[#0f172a] border border-blue-500/10 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">SaaS Operating Flowrate</p>
                          <p className="text-[10px] text-slate-400">Monthly scale metric graph representing complete system delivery health.</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                          Active System Growth Peak
                        </span>
                      </div>

                      {/* Animated Chart Frame */}
                      <div className="w-full relative h-[180px] bg-slate-950/40 rounded-xl border border-blue-500/5 overflow-hidden flex items-end">
                        <svg className="w-full h-full absolute inset-0 preserve-3d" viewBox="0 0 480 180" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal guidelines */}
                          <line x1="0" y1="45" x2="480" y2="45" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="0" y1="90" x2="480" y2="90" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="0" y1="135" x2="480" y2="135" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />

                          {/* Shaded Area */}
                          <path d={`M 0,180 L ${points} L 480,180 Z`} fill="url(#gradient-blue)" />

                          {/* Line drawing animation */}
                          <motion.path
                            d={`M ${points}`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.8, ease: "easeInOut" }}
                          />
                        </svg>

                        {/* Staggered load bar columns at bottom */}
                        <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-between px-10 pointer-events-none">
                          {[35, 48, 62, 55, 75, 85, 68, 92, 98].map((percent, index) => (
                            <motion.div
                              key={index}
                              initial={{ height: "0%" }}
                              animate={{ height: `${percent * 0.9}%` }}
                              transition={{ delay: index * 0.1, duration: 1.0, ease: "easeOut" }}
                              className="w-2 rounded bg-indigo-500/10 border-t border-indigo-400/30"
                            />
                          ))}
                        </div>

                        {/* Overlaid indicators */}
                        <div className="absolute top-4 left-6 flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                          <span className="text-[9px] font-mono text-slate-400">Live feed monitor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: JOBS PAGE */}
                {activeTab === 'jobs' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase font-mono">Job Pool Archives</h3>
                        <p className="text-[10px] text-slate-400">All registered client and admin requests filed in platform database.</p>
                      </div>
                      <button 
                        onClick={() => setShowAddJob(!showAddJob)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/15"
                      >
                        <Plus className="w-4 h-4" />
                        <span>POST NEW JOB</span>
                      </button>
                    </div>

                    {showAddJob && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={handleCreateJob}
                        className="bg-[#0f172a] border border-blue-500/15 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <div className="sm:col-span-2 border-b border-blue-500/10 pb-3">
                          <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Create Dynamic Sworn Job Record</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Job Title</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Sworn Medical Directives Manual"
                            value={newJob.title}
                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                            className="w-full bg-slate-950 text-xs px-3 py-2 border border-blue-500/10 rounded-xl text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Region Dialect</label>
                          <input 
                            type="text"
                            value={newJob.dialect}
                            onChange={(e) => setNewJob({ ...newJob, dialect: e.target.value })}
                            className="w-full bg-slate-950 text-xs px-3 py-2 border border-blue-500/10 rounded-xl text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Source Language</label>
                          <select 
                            value={newJob.sourceLanguage}
                            onChange={(e) => setNewJob({ ...newJob, sourceLanguage: e.target.value })}
                            className="w-full bg-slate-950 text-xs px-3 py-2 border border-blue-500/10 rounded-xl text-slate-200"
                          >
                            <option value="English">English</option>
                            <option value="Amharic">Amharic</option>
                            <option value="Afaan Oromo">Afaan Oromo</option>
                            <option value="Tigrinya">Tigrinya</option>
                            <option value="Somali">Somali</option>
                            <option value="French">French</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Target Language</label>
                          <select 
                            value={newJob.targetLanguage}
                            onChange={(e) => setNewJob({ ...newJob, targetLanguage: e.target.value })}
                            className="w-full bg-slate-950 text-xs px-3 py-2 border border-blue-500/10 rounded-xl text-slate-200"
                          >
                            <option value="Amharic">Amharic</option>
                            <option value="English">English</option>
                            <option value="Afaan Oromo">Afaan Oromo</option>
                            <option value="Tigrinya">Tigrinya</option>
                            <option value="Somali">Somali</option>
                            <option value="French">French</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Word Count</label>
                          <input 
                            type="number"
                            value={newJob.wordCount}
                            onChange={(e) => setNewJob({ ...newJob, wordCount: Number(e.target.value) })}
                            className="w-full bg-slate-950 text-xs px-3 py-2 border border-blue-500/10 rounded-xl text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Agreed Price (ETB)</label>
                          <input 
                            type="number"
                            value={newJob.price}
                            onChange={(e) => setNewJob({ ...newJob, price: Number(e.target.value) })}
                            className="w-full bg-slate-950 text-xs px-3 py-2 border border-blue-500/10 rounded-xl text-slate-200"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-400">Project Guidelines & Requirements</label>
                          <textarea 
                            rows={3}
                            placeholder="Detail requirements of regional sworn seal allocations..."
                            value={newJob.description}
                            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                            className="w-full bg-slate-950 text-xs p-3 border border-blue-500/10 rounded-xl text-slate-200 resize-none"
                          />
                        </div>
                        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setShowAddJob(false)}
                            className="px-4 py-2 rounded-xl bg-slate-950 text-xs font-bold text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                          >
                            {submitting ? 'Post-Processing...' : 'Deploy Job'}
                          </button>
                        </div>
                      </motion.form>
                    )}

                    <div className="space-y-3">
                      {requests.map(req => (
                        <div key={req.id} className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wide uppercase text-white ${
                                  req.status === RequestStatus.COMPLETED ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {req.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">ID: {req.id}</span>
                              </div>
                              <h4 className="text-sm font-semibold text-white mt-1.5">{req.title}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">{req.sourceLanguage} ➔ {req.targetLanguage} | Dialect: {req.dialect}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold font-mono text-blue-400">ETB {req.price?.toLocaleString() || 0}</span>
                              <span className="block text-[10px] text-slate-500">{req.wordCount} words</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-350 italic text-slate-400">"{req.description || 'No descriptive guidelines provided.'}"</p>

                          <div className="border-t border-blue-500/10 pt-3 flex flex-wrap gap-3 items-center justify-between text-[11px] text-slate-400">
                            <div>
                              <span>Linguist Allocated: </span>
                              <span className="text-slate-200 font-bold underline">
                                {req.assignedFreelancerName || 'Not Assigned'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Action options */}
                              {req.status === RequestStatus.UNDER_REVIEW && (
                                <>
                                  <button
                                    onClick={() => handleUpdateJobStatus(req.id, RequestStatus.COMPLETED)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[10px] text-white font-bold"
                                  >
                                    Accept Delivery
                                  </button>
                                  <button
                                    onClick={() => handleUpdateJobStatus(req.id, RequestStatus.REVISION_REQUESTED)}
                                    className="px-3 py-1 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/20 rounded text-[10px] text-rose-400"
                                  >
                                    Reject Delivery
                                  </button>
                                </>
                              )}
                              <span className="text-[10px] font-mono font-bold text-slate-500">Progress: {req.progressPercentage || 0}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: APPLICATIONS PAGE */}
                {activeTab === 'applications' && (
                  <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                      <p className="text-xs font-bold text-white uppercase font-mono">Freelancer Onboard Tracking Registry</p>
                      <p className="text-[10px] text-slate-400">Review language specialist applications and authorize status allocations.</p>
                    </div>

                    <div className="space-y-3">
                      {applications.map(app => (
                        <div key={app.id} className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white uppercase">{app.fullName}</h4>
                              <p className="text-xs text-slate-400 font-mono">{app.email} | {app.phone}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold uppercase ${
                              app.status === 'Approved' ? 'bg-emerald-600/20 text-emerald-400' : app.status === 'Rejected' ? 'bg-rose-600/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/40 p-3 rounded-xl border border-blue-500/5 text-xs text-slate-400 font-mono">
                            <div>
                              <span className="text-slate-500 block text-[9px]">EXPERIENCE YEARS</span>
                              <span className="text-slate-200 mt-1 block">{app.experienceYears} Years</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">LITERARY STUDIES</span>
                              <span className="text-slate-200 mt-1 block truncate" title={app.education}>{app.education}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">LANGUAGE COMBOS</span>
                              <span className="text-slate-200 mt-1 block tracking-tight">
                                {app.sourceLanguages?.join(', ')} ➔ {app.targetLanguages?.join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">SPECIALTY AREAS</span>
                              <span className="text-slate-200 mt-1 block truncate">
                                {app.specializations?.join(', ') || 'General Proof'}
                              </span>
                            </div>
                          </div>

                          {app.status === 'Pending' && (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleOnboardApp(app.id, 'Approved')}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Approve Specialist
                              </button>
                              <button
                                onClick={() => handleOnboardApp(app.id, 'Rejected')}
                                className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 border border-rose-500/20 text-[#f43f5e] text-[10px] font-bold uppercase tracking-wide cursor-pointer text-rose-400"
                              >
                                Decline Onboard
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: USERS PAGE */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    <div className="bg-[#0f172a] p-5 rounded-2xl border border-blue-500/10 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <p className="text-xs font-bold text-white uppercase font-mono">Platform Personnel Registry</p>
                        <p className="text-[10px] text-slate-400">Manage accessibility tokens, reset security variables, and adjust credentials.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('add-user')}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xl"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add New User</span>
                      </button>
                    </div>

                    {editUserSuccess && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400">
                        {editUserSuccess}
                      </div>
                    )}

                    {passwordResetSuccess && (
                      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-400">
                        {passwordResetSuccess}
                      </div>
                    )}

                    <div className="space-y-3">
                      {usersList.map(usr => (
                        <div key={usr.id} className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-5 space-y-4">
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-white">{usr.fullName}</span>
                                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold text-white bg-blue-600/20 border border-blue-500/20">
                                  {usr.role}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold ${
                                  usr.status === 'Suspended' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {usr.status}
                                </span>
                                {usr.id === user.id && (
                                  <span className="text-[8px] font-mono text-blue-400 px-1 border border-blue-500/20 rounded">(You)</span>
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-slate-400">{usr.email} | Phone: {usr.phone || 'Unavailable'}</p>
                              
                              {/* Extra role-specific information block */}
                              <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-white/5">
                                {(usr as any).companyName && <span>Company: <strong className="text-slate-350">{(usr as any).companyName}</strong></span>}
                                {(usr as any).dialectSpecializations && (usr as any).dialectSpecializations.length > 0 && (
                                  <span>Languages: <strong className="text-slate-350">{(usr as any).dialectSpecializations.join(', ')}</strong></span>
                                )}
                                {(usr as any).experienceYears !== undefined && (usr as any).experienceYears > 0 && (
                                  <span className="ml-2">| Experience: <strong className="text-slate-350">{(usr as any).experienceYears} Years</strong></span>
                                )}
                                {(usr as any).department && <span>Department: <strong className="text-slate-350">{(usr as any).department}</strong></span>}
                                {(usr as any).languageSpecialization && (
                                  <span className="ml-2">| Specialization: <strong className="text-slate-350">{(usr as any).languageSpecialization}</strong></span>
                                )}
                                {(usr as any).accessLevel && <span>Clearance: <strong className="text-slate-350">{(usr as any).accessLevel}</strong></span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => startEditingUser(usr)}
                                className="p-1 px-3 rounded hover:bg-blue-600/20 text-blue-400 border border-blue-500/15 text-[9px] font-bold font-mono tracking-wider uppercase cursor-pointer"
                              >
                                Edit Profile
                              </button>
                              
                              <button
                                onClick={() => {
                                  setResettingUserId(usr.id);
                                  setNewPasswordInput('');
                                  setPasswordResetSuccess(null);
                                }}
                                className="p-1 px-3 rounded hover:bg-amber-600/20 text-amber-400 border border-amber-500/15 text-[9px] font-bold font-mono tracking-wider uppercase cursor-pointer"
                              >
                                Reset Pass
                              </button>

                              {/* Toggle Deactivate button */}
                              {usr.id !== user.id && (
                                usr.status === 'Active' ? (
                                  <button
                                    onClick={() => handleToggleUserStatus(usr)}
                                    className="p-1 px-3 rounded hover:bg-rose-600/20 text-rose-450 border border-rose-500/15 text-[9px] font-bold font-mono tracking-wider uppercase cursor-pointer text-rose-400"
                                  >
                                    Suspended
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleUserStatus(usr)}
                                    className="p-1 px-3 rounded hover:bg-emerald-600/20 text-emerald-455 border border-emerald-500/15 text-[9px] font-bold font-mono tracking-wider uppercase cursor-pointer text-emerald-400"
                                  >
                                    Activate Access
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          {/* INLINE EDIT PANEL */}
                          {editingUserId === usr.id && (
                            <form onSubmit={(e) => handleAdminUpdateUserSubmit(e, usr.id)} className="p-4 bg-slate-950/60 rounded-xl border border-blue-500/10 space-y-3 mt-2">
                              <p className="text-[10px] font-bold text-blue-400 uppercase font-mono tracking-wide">Modify Member Credentials</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-1 font-mono">Full Name</label>
                                  <input
                                    type="text"
                                    value={editUserForm.fullName}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-1 font-mono">Email Address</label>
                                  <input
                                    type="email"
                                    value={editUserForm.email}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-1 font-mono">Phone Number</label>
                                  <input
                                    type="text"
                                    value={editUserForm.phone}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                                  />
                                </div>
                              </div>

                              {/* Specific fields depending on role */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-350 border-t border-white/5 pt-2">
                                {usr.role === UserRole.CLIENT && (
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] text-slate-400 mb-1 font-mono">Company Name</label>
                                    <input
                                      type="text"
                                      value={editUserForm.companyName}
                                      onChange={(e) => setEditUserForm({ ...editUserForm, companyName: e.target.value })}
                                      className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs"
                                    />
                                  </div>
                                )}

                                {usr.role === UserRole.FREELANCER && (
                                  <>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-1 font-mono">Specialized Languages (comma separated)</label>
                                      <input
                                        type="text"
                                        value={editUserForm.languages}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, languages: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-1 font-mono">Years Experience</label>
                                      <input
                                        type="number"
                                        value={editUserForm.experienceYears}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, experienceYears: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs"
                                      />
                                    </div>
                                  </>
                                )}

                                {usr.role === UserRole.EMPLOYEE && (
                                  <>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-1 font-mono">Operations Department</label>
                                      <input
                                        type="text"
                                        value={editUserForm.department}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, department: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-1 font-mono">Sworn Specialization</label>
                                      <input
                                        type="text"
                                        value={editUserForm.languageSpecialization}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, languageSpecialization: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs"
                                      />
                                    </div>
                                  </>
                                )}

                                {usr.role === UserRole.ADMIN && (
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] text-slate-400 mb-1 font-mono">Privilege Level</label>
                                    <input
                                      type="text"
                                      value={editUserForm.accessLevel}
                                      onChange={(e) => setEditUserForm({ ...editUserForm, accessLevel: e.target.value })}
                                      className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingUserId(null)}
                                  className="px-3 py-1.5 rounded bg-[#1e293b] text-[10px] font-semibold text-slate-300 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 rounded bg-blue-600 text-[10px] font-bold text-white cursor-pointer hover:bg-blue-500"
                                >
                                  Save Updates
                                </button>
                              </div>
                            </form>
                          )}

                          {/* INLINE PASSWORD RESET PANEL */}
                          {resettingUserId === usr.id && (
                            <form onSubmit={(e) => handleAdminResetPasswordSubmit(e, usr.id)} className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/15 space-y-3 mt-2">
                              <p className="text-[10px] font-bold text-amber-500 uppercase font-mono tracking-wide">Issue Forced Password Reset</p>
                              
                              <div className="flex gap-3 items-end flex-wrap">
                                <div className="flex-1 min-w-[200px]">
                                  <label className="block text-[10px] text-slate-400 mb-1 font-mono font-medium">Define Temporary Reset Password Value</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Enter secure temporary password"
                                    value={newPasswordInput}
                                    onChange={(e) => setNewPasswordInput(e.target.value)}
                                    className="w-full bg-slate-900 border border-amber-500/10 p-2 rounded text-xs text-white"
                                  />
                                </div>
                                
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setResettingUserId(null)}
                                    className="px-3 py-1.5 rounded bg-[#1e293b] text-[10px] font-semibold text-slate-300 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 rounded bg-amber-600 text-[10px] font-bold text-white hover:bg-amber-500 cursor-pointer shadow-lg"
                                  >
                                    Reset Password
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: FEEDBACK PAGE */}
                {activeTab === 'feedback' && (
                  <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                      <p className="text-xs font-bold text-white uppercase font-mono">Platform Customer Feedback Nodes</p>
                      <p className="text-[10px] text-slate-400">Direct satisfaction ratings logged from active client accounts.</p>
                    </div>

                    {replySuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 animate-bounce">
                        {replySuccessMsg}
                      </div>
                    )}

                    <div className="space-y-3">
                      {feedbacks.map(feed => (
                        <div key={feed.id} className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-white uppercase font-mono">{feed.senderName}</span>
                              <span className="text-[10px] text-slate-500 ml-2">({feed.role})</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">{new Date(feed.createdAt).toLocaleDateString()}</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed font-sans italic">"{feed.projectFeedback}"</p>
                          
                          <div className="pt-2 border-t border-blue-500/10 space-y-2">
                            <p className="text-[10px] text-blue-400 uppercase font-mono font-bold">DISPATCH RESPONSE MANUAL</p>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Type direct email feedback response..."
                                value={feedReplies[feed.id] || ''}
                                onChange={(e) => setFeedReplies({ ...feedReplies, [feed.id]: e.target.value })}
                                className="flex-1 bg-slate-950 border border-blue-500/10 text-xs p-2 rounded-xl focus:outline-none"
                              />
                              <button
                                onClick={() => submitFeedbackReply(feed.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5.5: ADD USER PAGE */}
                {activeTab === 'add-user' && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-[#0f172a] p-5 rounded-2xl border border-blue-500/10 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                      <h3 className="text-sm font-bold text-white uppercase font-mono tracking-tight flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-400" />
                        <span>Provision New Ecosystem Account</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Manually configure credentials. Users receive simulated credentials and are forced to update their password on first login.
                      </p>
                    </div>

                    {addUserSuccess && (
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-pulse">
                        <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{addUserSuccess}</span>
                      </div>
                    )}

                    {addUserError && (
                      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-400 font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{addUserError}</span>
                      </div>
                    )}

                    <form onSubmit={handleAdminCreateUser} className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono tracking-wide">Ecosystem Role</label>
                          <select
                            value={newUserForm.role}
                            onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                            className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value={UserRole.FREELANCER}>Freelancer (Specialist Translator)</option>
                            <option value={UserRole.CLIENT}>Client (Company Requestor)</option>
                            <option value={UserRole.EMPLOYEE}>Employee (Internal Linguist)</option>
                            <option value={UserRole.ADMIN}>Admin (Supervisor Manager)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono tracking-wide">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="user@yegnalisan.com"
                            value={newUserForm.email}
                            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                            className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono tracking-wide">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Eg. Almaz Kebede"
                            value={newUserForm.fullName}
                            onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                            className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono tracking-wide">Contact Phone Number</label>
                          <input
                            type="text"
                            required
                            placeholder="+251 911 34 5678"
                            value={newUserForm.phone}
                            onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                            className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono tracking-wide">Initial Password</label>
                          <input
                            type="text"
                            required
                            placeholder="tempPassword123"
                            value={newUserForm.password}
                            onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                            className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex items-center gap-2 h-full sm:pt-6 pl-1">
                          <input
                            type="checkbox"
                            id="isTemporary"
                            checked={newUserForm.isTemporary}
                            onChange={(e) => setNewUserForm({ ...newUserForm, isTemporary: e.target.checked })}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-950 border-blue-510"
                          />
                          <label htmlFor="isTemporary" className="text-xs font-semibold text-slate-400 select-none cursor-pointer font-sans">
                            Force password reset on first login
                          </label>
                        </div>
                      </div>

                      {/* ROLE-SPECIFIC DYNAMIC FORM EXTRA FIELDS */}
                      <div className="border-t border-blue-500/10 pt-4 mt-2">
                        <h4 className="text-[11px] font-bold text-blue-400 uppercase font-mono tracking-wider mb-3">Role-Specific Configurations</h4>
                        
                        {newUserForm.role === UserRole.CLIENT && (
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company Name (Optional)</label>
                              <input
                                type="text"
                                placeholder="E.g., Ethiopian Telecom"
                                value={newUserForm.companyName}
                                onChange={(e) => setNewUserForm({ ...newUserForm, companyName: e.target.value })}
                                className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {newUserForm.role === UserRole.FREELANCER && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Dialect / Language Combos</label>
                              <input
                                type="text"
                                placeholder="Amharic, English, French"
                                value={newUserForm.languages}
                                onChange={(e) => setNewUserForm({ ...newUserForm, languages: e.target.value })}
                                className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Years of Experience</label>
                              <input
                                type="number"
                                min="0"
                                value={newUserForm.experienceYears}
                                onChange={(e) => setNewUserForm({ ...newUserForm, experienceYears: e.target.value })}
                                className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {newUserForm.role === UserRole.EMPLOYEE && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Department</label>
                              <input
                                type="text"
                                placeholder="E.g., Sworn Operations"
                                value={newUserForm.department}
                                onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                                className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Specialized Language Deck</label>
                              <input
                                type="text"
                                placeholder="E.g., German / Amharic Sworn"
                                value={newUserForm.languageSpecialization}
                                onChange={(e) => setNewUserForm({ ...newUserForm, languageSpecialization: e.target.value })}
                                className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {newUserForm.role === UserRole.ADMIN && (
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Privilege Clearance Level</label>
                              <input
                                type="text"
                                placeholder="E.g., Operations Director Admin"
                                value={newUserForm.accessLevel}
                                onChange={(e) => setNewUserForm({ ...newUserForm, accessLevel: e.target.value })}
                                className="w-full bg-slate-950 border border-blue-500/10 text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 mt-4"
                      >
                        {submitting ? 'Constructing credentials data entries...' : 'Configure Ecosystem User Record'}
                      </button>
                    </form>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
