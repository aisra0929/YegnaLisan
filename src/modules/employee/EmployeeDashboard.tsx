/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, TranslationRequest, RequestStatus, GlossaryTerm, FileType } from '../../types';
import { translations, LanType } from '../../lib/translations';
import { 
  Menu, X, LogOut, LayoutDashboard, ListTodo, Wrench, MessageSquare, UserCircle,
  Upload, Search, ArrowRight, Play, Download, Save, RefreshCw, FileText, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeeDashboardProps {
  user: User;
  onLogout: () => void;
  activeLanguage: LanType;
  activeTheme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

export default function EmployeeDashboard({ 
  user, 
  onLogout,
  activeLanguage,
  activeTheme,
  toggleTheme,
  toggleLanguage
}: EmployeeDashboardProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'work-aid' | 'messages' | 'profile'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Database States
  const [requests, setRequests] = useState<TranslationRequest[]>([]);
  const [glossaries, setGlossaries] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter Tasks Tab
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  // Work Aid Tab States
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Amharic');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [aiTranslating, setAiTranslating] = useState(false);

  // Dictionary Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [dictionaryResults, setDictionaryResults] = useState<GlossaryTerm[]>([]);

  // Selected Active Task Modal/Detail
  const [selectedTask, setSelectedTask] = useState<TranslationRequest | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // System Messages Simulation
  const [messages, setMessages] = useState([
    { id: '1', from: 'Helen Tekle (Freelancer)', text: 'Submitted the Oromo guidance manual version for segment checking.', time: '10 min ago' },
    { id: '2', from: 'Amara Belay (Client)', text: 'Can you ensure the legal seal is stamped on the regional prospectus?', time: '2 hours ago' },
    { id: '3', from: 'System Automated', text: 'Daily database backup finalized successfully.', time: '5 hours ago' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const t = translations[activeLanguage];

  // Fetch from in-memory backend
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [reqResp, glossResp] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/glossary')
      ]);

      if (reqResp.ok) setRequests(await reqResp.json());
      if (glossResp.ok) setGlossaries(await glossResp.json());
    } catch (e) {
      console.error("Failed to sync employee databases", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter Glossary terms on typo query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDictionaryResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = glossaries.filter(g => 
      g.termEn.toLowerCase().includes(q) || 
      (g.termAmh && g.termAmh.toLowerCase().includes(q)) || 
      (g.definition && g.definition.toLowerCase().includes(q))
    );
    setDictionaryResults(matches);
  }, [searchQuery, glossaries]);

  // Handle Simulated drag-and-drop / file upload click
  const handleDummyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      
      // Load standard content as template helper
      const reader = new FileReader();
      reader.onload = () => {
        let content = typeof reader.result === 'string' ? reader.result : '';
        if (content.length > 2000) content = content.substring(0, 2000) + '...';
        setInputText(content || `[Contents of ${file.name} - Ready for processing]`);
      };
      reader.readAsText(file);
    }
  };

  // AI Translate Action via express proxy server
  const handleAiTranslate = async () => {
    if (!inputText.trim()) {
      setAlertMsg("Please upload a document or enter source query text inside the left panel.");
      return;
    }
    setAiTranslating(true);
    setAlertMsg(null);
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.draft || '');
      } else {
        setAlertMsg("AI Translate service fallback dispatched.");
      }
    } catch (e) {
      console.error(e);
      setAlertMsg("Translation pipeline running in fallback mode.");
    } finally {
      setAiTranslating(false);
    }
  };

  // Trigger download of translated file as text document blob
  const handleDownloadFile = () => {
    if (!translatedText.trim()) {
      setAlertMsg("Nothing to download yet. Perform a translation task first.");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([translatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${uploadedFileName ? uploadedFileName.split('.')[0] : 'yegna_translation'}_translated.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setAlertMsg("Translated text dispatched as text attachment!");
  };

  // Save localized files to browser localStorage
  const handleSaveDraft = () => {
    localStorage.setItem('yegna_employee_draft_in', inputText);
    localStorage.setItem('yegna_employee_draft_out', translatedText);
    setAlertMsg("Draft saved safely inside browser workspace storage!");
    setTimeout(() => setAlertMsg(null), 3500);
  };

  // Update Status Approve / Decline
  const handleTaskStatusChange = async (reqId: string, status: RequestStatus) => {
    try {
      const resp = await fetch(`/api/requests/${reqId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (resp.ok) {
        setAlertMsg(`Task successfully updated status to ${status}!`);
        setSelectedTask(null);
        fetchAllData();
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: String(messages.length + 1),
      from: 'You (Employee Specialist)',
      text: newMessage,
      time: 'Just now'
    }]);
    setNewMessage('');
  };

  // Compute status cards counts dynamically from requests
  const activeTasks = requests.filter(r => r.status === RequestStatus.ASSIGNED || r.status === RequestStatus.IN_PROGRESS).length;
  const pendingReviews = requests.filter(r => r.status === RequestStatus.UNDER_REVIEW).length;
  const completedTasks = requests.filter(r => r.status === RequestStatus.COMPLETED).length;
  const overdueTasks = requests.filter(r => r.status === RequestStatus.REVISION_REQUESTED).length; // Revision acts as pending overdue focus

  // Dynamic filter lists
  const filteredRequests = requests.filter(r => {
    if (taskFilter === 'ALL') return true;
    if (taskFilter === 'IN_PROGRESS') return r.status === RequestStatus.ASSIGNED || r.status === RequestStatus.IN_PROGRESS || r.status === RequestStatus.UNDER_REVIEW;
    if (taskFilter === 'COMPLETED') return r.status === RequestStatus.COMPLETED;
    return true;
  });

  return (
    <div className="h-screen bg-[#070b19] font-sans text-slate-200 flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <div className={`flex-shrink-0 bg-[#0f172a] border-r border-blue-500/10 transition-all duration-300 flex flex-col h-screen overflow-y-auto ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-blue-500/10">
          <div className="p-1.5 rounded-xl bg-blue-600 border border-white/10 shrink-0">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div>
              <p className="text-xs font-black tracking-wider text-white uppercase">Yegna Lisan</p>
              <p className="text-[9px] font-bold text-blue-400 tracking-tight uppercase">Employee Deck</p>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 py-6 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'tasks', label: 'My Tasks', icon: ListTodo },
            { id: 'work-aid', label: 'Work Aid Tool', icon: Wrench },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'profile', label: 'My Profile', icon: UserCircle }
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

        {/* Info footer */}
        {isSidebarOpen && (
          <div className="p-4 m-4 rounded-2xl bg-slate-900/60 border border-blue-500/5 text-center">
            <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-mono">Operations Officer</p>
          </div>
        )}
      </div>

      {/* CORE WORKSPACE PANELS */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Ribbon */}
        <header className="h-16 bg-[#0f172a] border-b border-blue-500/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-850 border border-blue-500/10 text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {activeTab === 'dashboard' ? 'Control Board' : activeTab.replace('-', ' ').toUpperCase()}
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

        {/* Scrollable Workstage */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {alertMsg && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-400 flex items-center justify-between">
              <span>{alertMsg}</span>
              <button onClick={() => setAlertMsg(null)} className="font-bold text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-xs text-slate-500 font-mono">Syncing quality logs...</p>
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
                
                {/* MODULE 1: CONTROL BOARD / OVERVIEW */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Simplified Count Cards Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { title: 'Active Tasks', value: activeTasks, desc: 'Allocated to liguists', style: 'text-blue-400' },
                        { title: 'Pending Review', value: pendingReviews, desc: 'Requires employee signature', style: 'text-amber-400' },
                        { title: 'Completed Pool', value: completedTasks, desc: 'Delivered successfully', style: 'text-emerald-400' },
                        { title: 'Revision Loops', value: overdueTasks, desc: 'Tasks sent back for rewrite', style: 'text-rose-400' }
                      ].map((item, id) => (
                        <div key={id} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl">
                          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{item.title}</p>
                          <p className={`text-3xl font-black font-mono mt-1 ${item.style}`}>{item.value}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Operational Guidelines info */}
                    <div className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white uppercase font-mono">SOP Sworn Document Quality Protocols</h4>
                        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                          As an Operations Officer, you verify translation outputs. For medical directives and corporate prospectuses, use the Work Aid Tool below to verify structural dialect consistency and glossary compliance.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('work-aid')}
                        className="px-4 py-2 text-xs font-bold shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>Open Work Aid</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* MODULE 2: MY TASKS */}
                {activeTab === 'tasks' && (
                  <div className="space-y-5">
                    {/* Filters Strip */}
                    <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-xl border border-blue-500/10 flex-wrap gap-2">
                      <div className="flex gap-1.5">
                        {(['ALL', 'IN_PROGRESS', 'COMPLETED'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setTaskFilter(f)}
                            className={`px-3 py-1.5 text-xs rounded-lg font-mono font-bold cursor-pointer transition ${
                              taskFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Matching orders: {filteredRequests.length}</span>
                    </div>

                    <div className="space-y-3">
                      {filteredRequests.map(req => (
                        <div key={req.id} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl space-y-3 hover:border-blue-500/20 transition">
                          <div className="flex justify-between items-start gap-3 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-white ${
                                  req.status === RequestStatus.COMPLETED ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/25' : 'bg-blue-600/20 text-blue-400 border border-blue-400/20'
                                }`}>
                                  {req.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">ID: {req.id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white mt-1.5">{req.title}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{req.sourceLanguage} ➔ {req.targetLanguage} | Dialect: {req.dialect || 'Standard'}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-blue-400">ETB {req.price?.toLocaleString() || 500}</span>
                              <span className="block text-[10px] text-slate-500">{req.wordCount} words</span>
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-blue-500/10 flex justify-between items-center flex-wrap gap-2 text-xs text-slate-400">
                            <div>
                              <span>Linguist: </span>
                              <span className="text-slate-200 font-semibold underline">{req.assignedFreelancerName || 'Awaiting Allocation'}</span>
                            </div>
                            <button
                              onClick={() => setSelectedTask(req)}
                              className="px-4.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-[10px] font-bold text-blue-400 uppercase tracking-wider cursor-pointer border border-blue-500/10"
                            >
                              Open Verification Desk
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Task Clearance Side Drawer/Dialog Details */}
                    {selectedTask && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-55">
                        <div className="bg-[#0f172a] border border-blue-500/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
                          <button 
                            onClick={() => setSelectedTask(null)}
                            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                          
                          <div>
                            <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">Inspection Deck</span>
                            <h3 className="text-sm font-bold text-white mt-0.5">{selectedTask.title}</h3>
                            <p className="text-xs text-slate-405">{selectedTask.sourceLanguage} ➔ {selectedTask.targetLanguage}</p>
                          </div>

                          <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1.5 text-slate-400 font-mono">
                            <p>Author Client: {selectedTask.clientName}</p>
                            <p>Assigned Translator: {selectedTask.assignedFreelancerName}</p>
                            <p>Budget Allocation: ETB {selectedTask.price}</p>
                            <p>Delivery Status: {selectedTask.status}</p>
                          </div>

                          {selectedTask.completedContent ? (
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase font-mono text-slate-500">Delivered Output Preview</p>
                              <div className="p-3 rounded bg-slate-950 text-xs font-mono text-slate-200 select-all border border-blue-500/5 max-h-40 overflow-y-auto">
                                {selectedTask.completedContent}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-450 italic">The freelancer has not uploaded the translation delivery package yet.</p>
                          )}

                          {selectedTask.status === RequestStatus.UNDER_REVIEW && (
                            <div className="pt-2 border-t border-blue-500/10 flex justify-end gap-2">
                              <button
                                onClick={() => handleTaskStatusChange(selectedTask.id, RequestStatus.COMPLETED)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase transition"
                              >
                                Approve Sworn Delivery
                              </button>
                              <button
                                onClick={() => handleTaskStatusChange(selectedTask.id, RequestStatus.REVISION_REQUESTED)}
                                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/20 text-[#f43f5e] text-xs font-bold uppercase text-rose-455 hover:text-white transition text-rose-400"
                              >
                                Decline and Demand Revision
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MODULE 3: WORK AID TOOL (Clean Core Utility) */}
                {activeTab === 'work-aid' && (
                  <div className="space-y-6">
                    {/* Selection Controls Row */}
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-500">Source Lang</label>
                          <select 
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="bg-slate-950 border border-blue-500/10 px-2.5 py-1.5 rounded-lg text-xs"
                          >
                            <option value="English">English</option>
                            <option value="Amharic">Amharic</option>
                            <option value="Afaan Oromo">Afaan Oromo</option>
                            <option value="Tigrinya">Tigrinya</option>
                            <option value="Somali">Somali</option>
                            <option value="French">French</option>
                          </select>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 mt-4 shrink-0" />
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono text-slate-500">Target Lang</label>
                          <select 
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="bg-slate-950 border border-blue-500/10 px-2.5 py-1.5 rounded-lg text-xs"
                          >
                            <option value="Amharic">Amharic</option>
                            <option value="English">English</option>
                            <option value="Afaan Oromo">Afaan Oromo</option>
                            <option value="Tigrinya">Tigrinya</option>
                            <option value="Somali">Somali</option>
                            <option value="French">French</option>
                          </select>
                        </div>
                      </div>

                      {/* Simulated drag-and-drop input label */}
                      <label className="px-4 py-2 rounded-xl border border-dashed border-blue-500/35 hover:border-blue-500 text-xs font-bold text-blue-400 bg-slate-950/40 cursor-pointer flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        <span>{uploadedFileName || 'UPLOAD SOURCE DOC (*.TXT)'}</span>
                        <input 
                          type="file" 
                          accept=".txt" 
                          onChange={handleDummyUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* Split Panel Translation Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Panel: Inputs */}
                      <div className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl flex flex-col space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-blue-500/5">
                          <p className="text-xs font-bold font-mono text-white uppercase">Source Editor Input</p>
                          <button 
                            onClick={() => setInputText('')} 
                            className="text-[10px] text-slate-500 hover:text-white"
                          >
                            Clear
                          </button>
                        </div>
                        <textarea
                          rows={8}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Type or drop source regional Amharic, Oromo, Tigrinya, or English lines here..."
                          className="w-full bg-slate-950 border border-blue-500/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none resize-none"
                        />
                        <button
                          onClick={handleAiTranslate}
                          disabled={aiTranslating}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{aiTranslating ? 'AI GENERATING TRANSLATION...' : 'TRANSLATE USING GEMINI'}</span>
                        </button>
                      </div>

                      {/* Right Panel: Output */}
                      <div className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl flex flex-col space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-blue-500/5">
                          <p className="text-xs font-bold font-mono text-white uppercase font-bold">Target Translation Area</p>
                          <span className="text-[9px] text-blue-400 font-mono tracking-wide">Ready for Delivery</span>
                        </div>
                        <textarea
                          rows={8}
                          value={translatedText}
                          onChange={(e) => setTranslatedText(e.target.value)}
                          placeholder="Generated multi-lingual high-fidelity draft output..."
                          className="w-full bg-slate-950 border border-blue-500/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none resize-none font-sans font-medium"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleSaveDraft}
                            className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/10"
                          >
                            <Save className="w-3.5 h-3.5 text-blue-400" />
                            <span>SAVE DRAFT</span>
                          </button>
                          <button
                            onClick={handleDownloadFile}
                            className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>DOWNLOAD FILE</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dictionary & Terminology search component */}
                    <div className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl space-y-3">
                      <div>
                        <p className="text-xs font-bold text-white uppercase font-mono">SaaS Integrated Glossary Lookup</p>
                        <p className="text-[10px] text-slate-500">Direct instant query definition search bar for legal/technical sworn matrices.</p>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Type English legal term (e.g. Joint Venture, Protocol, Asylum Seekers) or definitions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-blue-500/10 text-xs pl-10 pr-4 py-2.5 rounded-xl text-slate-250 focus:outline-none"
                        />
                      </div>

                      {dictionaryResults.length > 0 && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/55 border border-blue-500/5 max-h-48 overflow-y-auto">
                          {dictionaryResults.map(matched => (
                            <div key={matched.id} className="p-3 bg-slate-900 rounded border border-blue-500/5 text-xs flex justify-between items-start flex-wrap gap-2 text-slate-400 font-mono">
                              <div>
                                <span className="text-slate-200 block font-bold text-xs font-serif">{matched.termEn}</span>
                                <span className="text-[10px] text-slate-500 mt-1 block">Context Definition: {matched.definition || 'No structural context recorded.'}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-blue-400 font-bold font-serif text-sm block">{matched.termAmh}</span>
                                <span className="text-[8px] bg-blue-600/10 text-blue-400 px-1.5 rounded uppercase mt-1 inline-block">{matched.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MODULE 4: MESSAGES */}
                {activeTab === 'messages' && (
                  <div className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-5 space-y-4">
                    <div className="border-b border-blue-500/10 pb-3">
                      <p className="text-xs font-bold text-white uppercase font-mono">Operational Messages Channel</p>
                      <p className="text-[10px] text-slate-400 font-mono">Simulated instant coordinate updates from working linguist specialists.</p>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto p-1 text-xs">
                      {messages.map(msg => (
                        <div key={msg.id} className="p-4 bg-slate-950 rounded-xl space-y-1 border border-blue-500/5">
                          <div className="flex justify-between text-[10px] font-mono font-black text-slate-450 text-slate-500 uppercase">
                            <span>{msg.from}</span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="text-slate-200 font-sans italic">"{msg.text}"</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write dynamic message reply to linguists..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-slate-950 border border-blue-500/10 text-xs p-2.5 rounded-xl focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

                {/* MODULE 5: PROFILE */}
                {activeTab === 'profile' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 rounded-full border-2 border-blue-500/20 bg-slate-900 flex items-center justify-center overflow-hidden">
                        <UserCircle className="w-16 h-16 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">{user.fullName}</h4>
                        <p className="text-xs text-slate-500 font-mono">ID: {user.id}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/25 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        OPS OPERATIONS OFFICER
                      </span>
                    </div>

                    <div className="md:col-span-2 bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl space-y-4">
                      <p className="text-xs font-bold text-white uppercase font-mono pb-2 border-b border-blue-500/10">Personal Security Credentials Ledger</p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[10px] uppercase font-mono block">Registered Email</span>
                          <span className="text-slate-200 block font-mono font-bold">{user.email}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[10px] uppercase font-mono block">Verified Phone Contact</span>
                          <span className="text-slate-200 block font-mono font-bold">{user.phone || '+251 975 108 198'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[10px] uppercase font-mono block">Onboarding Date</span>
                          <span className="text-slate-200 block font-mono font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[10px] uppercase font-mono block">Status Policy</span>
                          <span className="text-emerald-400 block font-mono font-semibold">● FULL ACTIVE PASS</span>
                        </div>
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
