/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, TranslationRequest, RequestStatus, FileType } from '../../types';
import { translations, LanType } from '../../lib/translations';
import { 
  Menu, X, LogOut, LayoutDashboard, Briefcase, FileCheck, CheckCircle, 
  DollarSign, Star, Send, Upload, Trash, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FreelancerDashboardProps {
  user: User;
  onLogout: () => void;
  activeLanguage: LanType;
  activeTheme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

export default function FreelancerDashboard({ 
  user, 
  onLogout,
  activeLanguage,
  toggleTheme,
  toggleLanguage
}: FreelancerDashboardProps) {
  // Tabs Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'available' | 'applications' | 'active' | 'earnings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Synchronized States
  const [requests, setRequests] = useState<TranslationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<string | null>(null);

  // Submission area
  const [submittingJobId, setSubmittingJobId] = useState<string | null>(null);
  const [deliveredContent, setDeliveredContent] = useState('');
  const [deliveredFile, setDeliveredFile] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Earning payouts form
  const [payoutBank, setPayoutBank] = useState('Commercial Bank of Ethiopia (CBE)');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(user.walletBalance || 14500);
  const [payoutsHistory, setPayoutsHistory] = useState([
    { id: 'pay-1', amount: 4800, date: '2026-05-18', status: 'Settled', bank: 'CBE' },
    { id: 'pay-2', amount: 2500, date: '2026-06-02', status: 'Settled', bank: 'Telebirr' }
  ]);

  const t = translations[activeLanguage];

  // Fetch from express back-end node
  const fetchFreelancerData = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/requests');
      if (resp.ok) {
        setRequests(await resp.json());
      }
    } catch (e) {
      console.error("Error fetching requests matrix", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerData();
  }, []);

  // Freelancer applies to an available pending assignment job
  const handleApplyForJob = async (jobId: string) => {
    try {
      const resp = await fetch(`/api/requests/${jobId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          freelancerId: user.id,
          freelancerName: user.fullName
        })
      });

      if (resp.ok) {
        setAlert("Application successful! You have been allocated to this translation job.");
        fetchFreelancerData();
        setTimeout(() => setAlert(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Deliver translation work via the backend deliver API
  const handleSubmitDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveredContent.trim()) {
      setAlert("Please type or provide translation content before submitting.");
      return;
    }
    if (!submittingJobId) return;

    setIsSending(true);
    try {
      const resp = await fetch(`/api/requests/${submittingJobId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedContent: deliveredContent,
          completedFileName: deliveredFile || `completed_translation_${submittingJobId}.docx`,
          updaterName: user.fullName
        })
      });

      if (resp.ok) {
        setAlert("Delivered successfully! Your submission is now under review by our operations employee panel.");
        setSubmittingJobId(null);
        setDeliveredContent('');
        setDeliveredFile(null);
        fetchFreelancerData();
        setTimeout(() => setAlert(null), 4500);
      }
    } catch (e) {
      console.error("Failed to post delivery cargo", e);
    } finally {
      setIsSending(false);
    }
  };

  // Withdraw payout
  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = Number(payoutAmount);
    if (!cleanAmt || cleanAmt <= 0 || cleanAmt > walletBalance) {
      setAlert("Invalid payout details. Check your current wallet balance limit.");
      return;
    }

    setWalletBalance(prev => prev - cleanAmt);
    setPayoutsHistory([
      { id: `pay-${Date.now()}`, amount: cleanAmt, date: new Date().toISOString().split('T')[0], status: 'Processing', bank: payoutBank },
      ...payoutsHistory
    ]);
    setPayoutAmount('');
    setAlert(`Payout transfer of ETB ${cleanAmt} dispatched to CBE/Telebirr secure gateway.`);
    setTimeout(() => setAlert(null), 4000);
  };

  // Segment allocations filter calculations
  const availableJobs = requests.filter(r => r.status === RequestStatus.PENDING_ASSIGNMENT);
  const activeJobs = requests.filter(r => 
    r.assignedFreelancerId === user.id && 
    (r.status === RequestStatus.ASSIGNED || r.status === RequestStatus.IN_PROGRESS || r.status === RequestStatus.REVISION_REQUESTED)
  );
  const completedJobs = requests.filter(r => 
    r.assignedFreelancerId === user.id && 
    r.status === RequestStatus.COMPLETED
  );

  return (
    <div className="h-screen bg-[#070b19] font-sans text-slate-200 flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <div className={`flex-shrink-0 bg-[#0f172a] border-r border-blue-500/10 transition-all duration-300 flex flex-col h-screen overflow-y-auto ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Brand logo header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-blue-500/10">
          <div className="p-1.5 rounded-xl bg-blue-600 border border-white/10 shrink-0">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div>
              <p className="text-xs font-black tracking-wider text-white uppercase">Yegna Lisan</p>
              <p className="text-[9px] font-bold text-blue-400 tracking-tight uppercase">Translator Portal</p>
            </div>
          )}
        </div>

        {/* Sidebar Nav buttons */}
        <div className="flex-1 py-6 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'available', label: 'Available Jobs', icon: Briefcase },
            { id: 'applications', label: 'Applications', icon: FileCheck },
            { id: 'active', label: 'Active Jobs', icon: CheckCircle },
            { id: 'earnings', label: 'My Earnings', icon: DollarSign }
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
            <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-mono">Expert Translator</p>
          </div>
        )}
      </div>

      {/* WORKSPACE CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navigation strip */}
        <header className="h-16 bg-[#0f172a] border-b border-blue-500/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-850 border border-blue-500/10 text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {activeTab === 'dashboard' ? 'Translator Desk' : activeTab.replace('-', ' ').toUpperCase()}
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
          
          {alert && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-400 flex items-center justify-between animate-fade-in">
              <span>{alert}</span>
              <button onClick={() => setAlert(null)} className="font-bold text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <p className="text-xs text-slate-500 font-mono">Syncing available client escrows...</p>
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { title: 'Marketplace Jobs', value: availableJobs.length, desc: 'Ready for instant allocation', style: 'text-blue-400' },
                        { title: 'My Active Works', value: activeJobs.length, desc: 'Deliverables pending checks', style: 'text-indigo-400' },
                        { title: 'Settle Work Pool', value: completedJobs.length, desc: 'Approved items catalog', style: 'text-emerald-400' },
                        { title: 'Translator Level', value: 'Expert', desc: 'Authorized Sworn Officer', style: 'text-amber-500' }
                      ].map((card, id) => (
                        <div key={id} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl">
                          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{card.title}</p>
                          <p className={`text-3xl font-black font-mono mt-1 ${card.style}`}>{card.value}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0f172a] border border-blue-500/10 p-6 rounded-2xl space-y-1">
                      <h4 className="text-xs font-bold text-white uppercase font-mono">Sworn Certified Specialist Onboarding guidelines</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Welcome back. To search and lock client translation contracts, view the "Available Jobs" tab. For currently assigned contracts requiring translations, use the "Active Jobs" tab to perform direct inline translation cargo delivery.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: AVAILABLE JOBS */}
                {activeTab === 'available' && (
                  <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-white uppercase font-mono">Job Pool Marketplace</p>
                        <p className="text-[10px] text-slate-400">Lock high-paying certified translation requests instantly.</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Available: {availableJobs.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {availableJobs.map(job => (
                        <div key={job.id} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/20 text-indigo-400 font-mono tracking-wider font-bold uppercase border border-indigo-400/20">
                                {job.urgency}
                              </span>
                              <span className="text-xs font-bold text-blue-400 font-mono">ETB {job.price?.toLocaleString()}</span>
                            </div>

                            <h4 className="text-sm font-bold text-white font-sans truncate">{job.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">"{job.description}"</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono pt-2 border-t border-blue-500/5">
                              <span>Pairs: {job.sourceLanguage} ➔ {job.targetLanguage}</span>
                              <span className="text-right">Words: {job.wordCount}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleApplyForJob(job.id)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Lock & Start Job
                          </button>
                        </div>
                      ))}

                      {availableJobs.length === 0 && (
                        <div className="col-span-2 p-12 text-center rounded-2xl border border-blue-500/5 bg-slate-950/40 text-slate-500 text-xs font-serif">
                          No pending jobs available in the pool right now.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: APPLICATIONS STATUS */}
                {activeTab === 'applications' && (
                  <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                      <p className="text-xs font-bold text-white uppercase font-mono">My Certification Onboard Status</p>
                      <p className="text-[10px] text-slate-400 font-mono">Current security clear authorization credentials index.</p>
                    </div>

                    <div className="bg-[#0f172a] border border-blue-500/10 p-6 rounded-2xl space-y-4 max-w-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white font-mono uppercase">Amharic Technical Linguist Tier</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/20">
                          APPROVED ACTIVE PASS
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-400">
                        <p>Specialization Matches: <span className="text-slate-200">Legal Sworn Document Translation, Editing & Proofreading</span></p>
                        <p>Education Clear: <span className="text-slate-200 mt-1 block">BA, Foreign literature AAU studies</span></p>
                        <p>Accuracy Rating index: <span className="text-amber-500 font-mono font-bold">5.0 ★ Excellent rating</span></p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: ACTIVE JOBS (Delivering system) */}
                {activeTab === 'active' && (
                  <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                      <p className="text-xs font-bold text-white uppercase font-mono">Working Hand Area</p>
                      <p className="text-[10px] text-slate-400">Perform direct, high fidelity translation check outs and finalize deliveries.</p>
                    </div>

                    <div className="space-y-4">
                      {activeJobs.map(job => (
                        <div key={job.id} className="bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl space-y-4">
                          <div className="flex justify-between flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[8px] bg-amber-500/20 text-amber-400 font-mono font-bold tracking-wider uppercase border border-amber-500/20 text-indigo-400">
                                  {job.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">Project: {job.id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white mt-1">{job.title}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{job.sourceLanguage} ➔ {job.targetLanguage} | Word count: {job.wordCount}</p>
                            </div>

                            <button
                              onClick={() => {
                                setSubmittingJobId(job.id);
                                // Pre-fill default segments dummy text as reference helper
                                setDeliveredContent(`THE REGIONAL STATE OF ETHIOPIA - sworny translation document alignment.\n\nSection 1 terms:\nትርጉሙ በተሳካ ሁኔታ በኢትዮጵያ ቀበሌኛ በከፍተኛ ጥራት ተተርጉሟል።`);
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0 inline-flex items-center gap-1"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Submit completed work</span>
                            </button>
                          </div>

                          {/* Submit file upload details form */}
                          {submittingJobId === job.id && (
                            <form 
                              onSubmit={handleSubmitDeliver}
                              className="bg-slate-950 p-5 rounded-xl border border-blue-500/15 space-y-3 animate-fade-in"
                            >
                              <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-white/5">
                                <span className="text-blue-400">Delivery Payload Desk: {job.title}</span>
                                <button type="button" onClick={() => setSubmittingJobId(null)} className="text-slate-500 hover:text-white">✕</button>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-mono text-slate-500">Result Translated Content (TXT Copy)</label>
                                <textarea
                                  rows={5}
                                  required
                                  value={deliveredContent}
                                  onChange={(e) => setDeliveredContent(e.target.value)}
                                  placeholder="Type or paste completed translation target prose text cargo..."
                                  className="w-full bg-[#0f172a] border border-blue-500/10 p-3 text-xs text-slate-200 focus:outline-none rounded-xl resize-none font-mono"
                                />
                              </div>

                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-mono text-slate-500 block">Deliverable File Name</label>
                                  <input 
                                    type="text"
                                    value={deliveredFile || ''}
                                    placeholder="e.g. translation_delivery_fixed.docx"
                                    onChange={(e) => setDeliveredFile(e.target.value)}
                                    className="bg-[#0f172a] border border-blue-500/10 text-xs px-2.5 py-1.5 rounded-lg text-white"
                                  />
                                </div>
                                
                                <button
                                  type="submit"
                                  disabled={isSending}
                                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{isSending ? 'Sending cargo...' : 'Dispatch final delivery'}</span>
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}

                      {activeJobs.length === 0 && (
                        <div className="p-12 text-center rounded-2xl border border-blue-500/5 bg-slate-950/40 text-slate-500 text-xs font-serif">
                          No active translation jobs allocated to your queue right now. Go to "Available Jobs" to lock some!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: MY EARNINGS / CBE INTEGRATIONS */}
                {activeTab === 'earnings' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left: balance & withdraw */}
                      <div className="md:col-span-5 bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div>
                          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Total Locked Balance Ledger</p>
                          <p className="text-3xl font-black font-mono mt-1 text-emerald-400">ETB {walletBalance.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Ready for Commercial Bank of Ethiopia (CBE) / Telebirr instant payout clearance.</p>
                        </div>

                        <form onSubmit={handleRequestPayout} className="space-y-3 pt-3 border-t border-blue-500/5">
                          <div className="space-y-0.5">
                            <label className="text-[9px] uppercase font-mono text-slate-500 block">Payout Destination super-app</label>
                            <select
                              value={payoutBank}
                              onChange={(e) => setPayoutBank(e.target.value)}
                              className="w-full p-2 rounded-xl bg-slate-950 border border-blue-500/10 text-xs text-white"
                            >
                              <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                              <option value="Telebirr Pay">Telebirr SuperApp Pay</option>
                              <option value="Dashen Bank Amole">Dashen Bank Amole</option>
                            </select>
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[9px] uppercase font-mono text-slate-500 block">Payout Amount (ETB)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 2000"
                              value={payoutAmount}
                              onChange={(e) => setPayoutAmount(e.target.value)}
                              className="w-full p-2 bg-slate-950 border border-blue-500/10 rounded-xl text-xs text-white"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                          >
                            Release payout transfer
                          </button>
                        </form>
                      </div>

                      {/* Right: history */}
                      <div className="md:col-span-7 bg-[#0f172a] border border-blue-500/10 p-5 rounded-2xl space-y-4">
                        <p className="text-xs font-bold text-white uppercase font-mono pb-2 border-b border-blue-500/10">Payout settlements history</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {payoutsHistory.map(pay => (
                            <div key={pay.id} className="p-3 bg-slate-950 rounded-xl border border-blue-500/5 flex justify-between items-center text-xs text-slate-400 font-mono">
                              <div>
                                <span className="text-slate-200 block font-bold">ETB {pay.amount.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-500 mt-0.5 block">{pay.bank} | {pay.date}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                pay.status === 'Processing' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {pay.status}
                              </span>
                            </div>
                          ))}
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
