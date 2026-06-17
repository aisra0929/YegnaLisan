/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, TranslationRequest, RequestStatus, FileType } from '../../types';
import { translations, LanType } from '../../lib/translations';
import { 
  Menu, LogOut, LayoutDashboard, PlusCircle, Layers, CreditCard, 
  Upload, CheckCircle, Download, FileText, RefreshCw, Star, ShieldCheck, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
  activeLanguage: LanType;
  activeTheme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

export default function ClientDashboard({ 
  user, 
  onLogout,
  activeLanguage,
  toggleTheme,
  toggleLanguage
}: ClientDashboardProps) {
  // Tabs Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submit' | 'projects' | 'payments'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Synchronized States
  const [requests, setRequests] = useState<TranslationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // New Request Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [srcLang, setSrcLang] = useState('English');
  const [tgtLang, setTgtLang] = useState('Amharic');
  const [fileType, setFileType] = useState<FileType>(FileType.DOCUMENT);
  const [wordCount, setWordCount] = useState<number>(350);
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Express'>('Standard');
  const [fileName, setFileName] = useState('');
  const [dialect, setDialect] = useState('Standard Dialect');
  const [isConfidential, setIsConfidential] = useState(false);

  // Drag-and-Drop / File selection helper
  const [dragActive, setDragActive] = useState(false);

  // Static/Simulated Invoice Payments List
  const [invoices, setInvoices] = useState([
    { id: 'inv-101', project: 'Legal Sworn Document', amount: 1500, status: 'Paid', date: '2026-06-01' },
    { id: 'inv-102', project: 'Medical Orientation Guide', amount: 2800, status: 'Pending', date: '2026-06-05' }
  ]);

  const t = translations[activeLanguage];

  // Fetch from in-memory API
  const fetchClientRequests = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/requests?clientId=${user.id}`);
      if (resp.ok) {
        setRequests(await resp.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientRequests();
  }, [user.id]);

  // Submit translation request to server
  const handlePlaceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    try {
      const resp = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id,
          clientName: user.fullName,
          title,
          description,
          sourceLanguage: srcLang,
          targetLanguage: tgtLang,
          fileType,
          wordCount,
          urgency,
          fileName: fileName || 'unspecified_document.docx',
          fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
          dialect,
          isConfidential
        })
      });

      if (resp.ok) {
        setAlertMsg("Success! Your translation request has been submitted to employees.");
        setTitle('');
        setDescription('');
        setFileName('');
        setIsConfidential(false);
        fetchClientRequests();
        setActiveTab('projects');
        setTimeout(() => setAlertMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper file drag drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  // Download logic helper
  const handleDownloadFile = (req: TranslationRequest) => {
    const textToDownload = req.completedContent || "COMPLETED TRANSLATION TEXT DATA OUTPUT";
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = req.completedFileName || `${req.title.toLowerCase().replace(/\s+/g, '_')}_translated.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertMsg(`Downloaded delivery: ${req.completedFileName}`);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  // Categorizations
  const submittedTasks = requests.filter(r => r.status === RequestStatus.DRAFT || r.status === RequestStatus.PENDING_ASSIGNMENT);
  const inProgressTasks = requests.filter(r => r.status === RequestStatus.ASSIGNED || r.status === RequestStatus.IN_PROGRESS || r.status === RequestStatus.REVISION_REQUESTED || r.status === RequestStatus.UNDER_REVIEW);
  const completedTasks = requests.filter(r => r.status === RequestStatus.COMPLETED || r.status === RequestStatus.APPROVED);

  return (
    <div className="h-screen bg-[#070b19] font-sans text-slate-200 flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <div className={`flex-shrink-0 bg-[#0f172a] border-r border-blue-500/10 transition-all duration-300 flex flex-col h-screen overflow-y-auto ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-blue-500/10">
          <div className="p-1.5 rounded-xl bg-blue-600 border border-white/10 shrink-0 animate-pulse">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div>
              <p className="text-xs font-black tracking-wider text-white uppercase">Yegna Lisan</p>
              <p className="text-[9px] font-bold text-blue-400 tracking-tight uppercase">Client Console</p>
            </div>
          )}
        </div>

        {/* Sidebar Nav links */}
        <div className="flex-1 py-6 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'submit', label: 'Submit Request', icon: PlusCircle },
            { id: 'projects', label: 'My Projects', icon: Layers },
            { id: 'payments', label: 'Payments', icon: CreditCard }
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

        {/* Bottom card */}
        {isSidebarOpen && (
          <div className="p-4 m-4 rounded-2xl bg-slate-900/60 border border-blue-500/5 text-center">
            <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-mono">{user.email}</p>
          </div>
        )}
      </div>

      {/* CORE WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navigation Strip */}
        <header className="h-16 bg-[#0f172a] border-b border-blue-500/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-850 border border-blue-500/10 text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {activeTab === 'dashboard' ? 'Client Desk' : activeTab.replace('-', ' ').toUpperCase()}
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

        {/* Scrollable container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {alertMsg && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-400 flex items-center justify-between animate-fade-in">
              <span>{alertMsg}</span>
              <button onClick={() => setAlertMsg(null)} className="font-bold text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <p className="text-xs text-slate-500 font-mono">Syncing project pipeline...</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: 'Active Projects', value: inProgressTasks.length + submittedTasks.length, desc: 'Translation in pathway', style: 'text-blue-400' },
                        { title: 'Completed Projects', value: completedTasks.length, desc: 'Ready for sworn seal download', style: 'text-emerald-400' },
                        { title: 'Registered Invoices', value: invoices.length, desc: 'CBE / Telebirr status logs', style: 'text-indigo-400' }
                      ].map((card, idx) => (
                        <div key={idx} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl">
                          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{card.title}</p>
                          <p className={`text-4xl font-black font-mono mt-1 ${card.style}`}>{card.value}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0f172a] border border-blue-500/10 p-6 rounded-2xl space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase font-mono">Lisan Sworn Certification Standards</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Every translation document is vetted step-by-step up to 9 operational quality validation steps before seals are added. To issue a new job order, click the "Submit Request" navigator on the left sidebar.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: SUBMIT TRANSLATION REQUEST */}
                {activeTab === 'submit' && (
                  <div className="max-w-xl mx-auto bg-[#0f172a] border border-blue-500/10 p-6 md:p-8 rounded-2xl space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">Submit Translation Project</h3>
                      <p className="text-xs text-slate-400">Fill standard project parameters to match linguist groups.</p>
                    </div>

                    <form onSubmit={handlePlaceRequest} className="space-y-4">
                      
                      {/* Title block */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">Project Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Legal Agreement & Lease contract"
                          className="w-full bg-[#070b19] border border-blue-500/15 p-3 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 text-white font-mono"
                        />
                      </div>

                      {/* Grid pairs */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400">Source Language</label>
                          <select
                            value={srcLang}
                            onChange={(e) => setSrcLang(e.target.value)}
                            className="w-full bg-[#070b19] border border-blue-500/15 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                          >
                            {["English", "French", "Amharic", "Afaan Oromoo", "Tigrinya", "Somali"].map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400">Target Language</label>
                          <select
                            value={tgtLang}
                            onChange={(e) => setTgtLang(e.target.value)}
                            className="w-full bg-[#070b19] border border-blue-500/15 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                          >
                            {["Amharic", "English", "Afaan Oromoo", "Tigrinya", "Somali", "French"].map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400">Word Count</label>
                          <input 
                            type="number"
                            required
                            value={wordCount}
                            onChange={(e) => setWordCount(Number(e.target.value))}
                            className="w-full bg-[#070b19] border border-blue-500/15 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400">Urgency Level</label>
                          <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value as any)}
                            className="w-full bg-[#070b19] border border-blue-500/15 p-2.5 rounded-xl text-xs text-white"
                          >
                            <option value="Standard">Standard (72 Hours)</option>
                            <option value="Urgent">Urgent (36 Hours)</option>
                            <option value="Express">Express (12 Hours)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dialect */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400">Target dialect</label>
                          <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value)}
                            className="w-full bg-[#070b19] border border-blue-500/15 p-2.5 rounded-xl text-xs text-white"
                          >
                            <option value="Standard Dialect">Standard Unified</option>
                            <option value="Sheger Amharic">Addis Sheger (Formal)</option>
                            <option value="Gojjam Dialect">Gojjam Dialect</option>
                            <option value="Hararghe Oromo">Hararghe Oromo</option>
                          </select>
                        </div>

                        {/* Confidential toggle */}
                        <div className="flex items-center pt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isConfidential}
                              onChange={(e) => setIsConfidential(e.target.checked)}
                              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 bg-slate-950 border-white/10"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-300 block">Restricted Mode</span>
                              <span className="text-[9px] text-slate-500">Government level seal guard</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Text guidelines */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-slate-400">Interpretation Guidelines</label>
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Type terminology guidelines or dialetical requirements context..."
                          className="w-full bg-[#070b19] border border-blue-500/15 p-3 rounded-xl text-xs placeholder-slate-500 text-white resize-none"
                        />
                      </div>

                      {/* File Upload Area Drag & Drop */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-slate-400">Upload Source Documents</label>
                        <div 
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed p-5 rounded-xl text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            dragActive ? 'border-blue-500 bg-blue-600/5' : 'border-blue-500/15 bg-[#070b19] hover:bg-[#070b19]/90'
                          }`}
                        >
                          <Upload className="w-5 h-5 text-slate-400 animate-bounce" />
                          <p className="text-[10px] text-slate-400">
                            {fileName ? `File locked: ${fileName}` : 'Drag & drop source document here or type file name'}
                          </p>
                          <input 
                            type="text"
                            placeholder="File name reference"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="bg-slate-950/80 text-xs px-2 py-1 rounded border border-white/10 w-48 mt-1 text-center font-mono text-white placeholder-slate-600"
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer"
                      >
                        {submitting ? 'Creating order...' : 'Dispatch Project Request'}
                      </button>

                    </form>
                  </div>
                )}

                {/* TAB 3: MY PROJECTS */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    
                    {/* Status Sections */}
                    {[
                      { title: 'Completed Deliveries', list: completedTasks, icon: CheckCircle, cardStyle: 'border-emerald-500/20 bg-[#0f172a]/80' },
                      { title: 'In-Pathway Works', list: inProgressTasks, icon: RefreshCw, cardStyle: 'border-blue-500/10 bg-[#0f172a]' },
                      { title: 'Submitted & Unassigned Pool', list: submittedTasks, icon: FileText, cardStyle: 'border-slate-500/10 bg-[#0f172a]/60' }
                    ].map((section, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-blue-500/5">
                          <section.icon className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{section.title} ({section.list.length})</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {section.list.map(req => (
                            <div key={req.id} className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${section.cardStyle}`}>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="px-2 py-0.5 rounded text-[8px] bg-blue-600/15 text-blue-400 font-mono font-bold uppercase tracking-wider">
                                    {req.status}
                                  </span>
                                  <span className="text-xs font-bold text-white font-mono">ETB {req.price?.toLocaleString()}</span>
                                </div>

                                <h4 className="text-sm font-bold text-white">{req.title}</h4>
                                <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                                  <p>Source docs: {req.fileName} ({req.fileSize || '2.1 MB'})</p>
                                  <p>Pairs: {req.sourceLanguage} ➔ {req.targetLanguage}</p>
                                  <p>Word count: {req.wordCount} | Urgent: {req.urgency}</p>
                                  {req.assignedFreelancerName && <p className="text-blue-400 font-sans">Linguist: {req.assignedFreelancerName}</p>}
                                </div>
                              </div>

                              {/* Action Download Deliverables */}
                              {req.status === RequestStatus.COMPLETED && (
                                <div className="pt-2 border-t border-blue-500/5 flex justify-between items-center bg-slate-950/30 p-2.5 rounded-xl">
                                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Sworn Sealed</span>
                                  </span>

                                  <button
                                    onClick={() => handleDownloadFile(req)}
                                    className="px-3.5 py-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download translations</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          {section.list.length === 0 && (
                            <p className="text-[11px] text-slate-500 font-serif italic py-1 pl-2">None registered in this lifecycle state.</p>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                )}

                {/* TAB 4: PAYMENTS */}
                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                      <p className="text-xs font-bold text-white uppercase font-mono">Invoices Ledger History</p>
                      <p className="text-[10px] text-slate-400">Synchronized payment settlements tracked for Commercial Bank of Ethiopia (CBE) and Telebirr channels.</p>
                    </div>

                    <div className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl">
                      <div className="space-y-2">
                        {invoices.map(inv => (
                          <div key={inv.id} className="p-3 bg-slate-950 rounded-xl border border-blue-500/5 flex justify-between items-center text-xs font-mono">
                            <div>
                              <p className="text-slate-200 font-bold">{inv.project}</p>
                              <span className="text-[10px] text-slate-500 mt-1 block">Invoice: {inv.id} | Date: {inv.date}</span>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <span className="text-white font-bold">ETB {inv.amount.toLocaleString()}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                inv.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-500'
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
