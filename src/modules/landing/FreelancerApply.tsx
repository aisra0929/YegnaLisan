/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, Languages, Star, ArrowRight, ArrowLeft, Loader2, Send } from 'lucide-react';

interface FreelancerApplyProps {
  activeTheme?: 'light' | 'dark';
  activeLanguage?: 'ENG' | 'AMH';
}

export default function FreelancerApply({ activeTheme = 'dark', activeLanguage = 'ENG' }: FreelancerApplyProps) {
  const [activeTab, setActiveTab] = useState<'feedback' | 'onboard'>('feedback');
  
  // Feedback Form State (Page 8)
  const [feedbackStep, setFeedbackStep] = useState(1);
  const [instructionRating, setInstructionRating] = useState('Very clear');
  const [senderName, setSenderName] = useState('');
  const [projectFeedback, setProjectFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Onboard Application Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [expYears, setExpYears] = useState('3');
  const [pLink, setPLink] = useState('');
  const [languagesSelected, setLanguagesSelected] = useState<string[]>([]);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccess, setAppSuccess] = useState(false);

  const ratingsOptions = activeLanguage === 'AMH' ? [
    "በጣም ግልፅ ነው",
    "በከፊል ግልፅ ነው",
    "ግራ የሚያጋባ ነው",
    "ምንም መመሪያ አልተሰጠም"
  ] : [
    "Very clear",
    "Somewhat clear",
    "Confusing",
    "No instructions were given"
  ];

  const handleLanguageToggle = (lang: string) => {
    if (languagesSelected.includes(lang)) {
      setLanguagesSelected(languagesSelected.filter(l => l !== lang));
    } else {
      setLanguagesSelected([...languagesSelected, lang]);
    }
  };

  const submitFeedback = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const resp = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName || 'Anonymous Linguist',
          role: 'Freelancer',
          instructionRating,
          projectFeedback: projectFeedback || `Submitted feedback regarding instruction clarity: ${instructionRating}`
        })
      });
      if (resp.ok) {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackSuccess(false);
          setFeedbackStep(1);
          setSenderName('');
          setProjectFeedback('');
        }, 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const submitOnboardApp = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;
    setSubmittingApp(true);
    try {
      const resp = await fetch('/api/freelancers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          sourceLanguages: languagesSelected.slice(0, 1),
          targetLanguages: languagesSelected.slice(1),
          experienceYears: expYears,
          education,
          portfolioLink: pLink,
          feedbackRating: instructionRating
        })
      });
      if (resp.ok) {
        setAppSuccess(true);
        setTimeout(() => {
          setAppSuccess(false);
          setFullName('');
          setEmail('');
          setPhone('');
          setEducation('');
          setLanguagesSelected([]);
          setPLink('');
        }, 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingApp(false);
    }
  };

  const isDark = activeTheme === 'dark';

  return (
    <section id="freelance" className={`min-h-screen relative py-24 px-6 md:p-12 lg:px-24 transition-colors duration-300 scroll-mt-20 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-blue-500 font-semibold tracking-widest uppercase mb-1">
            {activeLanguage === 'AMH' ? 'ቡድናችንን ይቀላቀሉ' : 'Join the Team'}
          </span>
          <h2 className={`text-3xl sm:text-5xl font-sans font-black tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeLanguage === 'AMH' ? (
              <>የፍሪላንሰር <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">አስተያየት እና ምዝገባ</span></>
            ) : (
              <>Freelancer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Feedback & Recruiting</span></>
            )}
          </h2>
          <p className={`text-xs sm:text-sm mt-4 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {activeLanguage === 'AMH' 
              ? 'የትርጉም መመሪያዎችን ጥራት ይገምግሙ ወይም እንደ ማረጋገጫ ያለው ሙያዊ ተርጓሚ ምዝገባዎን ይጀምሩ።' 
              : 'Review project instruction quality metric poll or initiate your onboarding application as a certified legal translator.'}
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className={`flex h-12 p-1 max-w-sm mx-auto rounded-full border mb-10 ${
          isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 rounded-full text-xs font-semibold cursor-pointer transition ${
              activeTab === 'feedback' 
                ? 'bg-blue-600 font-bold text-white shadow-md' 
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {activeLanguage === 'AMH' ? 'የመመሪያዎች ዳሰሳ' : 'Instructions Poll'}
          </button>
          <button
            onClick={() => setActiveTab('onboard')}
            className={`flex-1 rounded-full text-xs font-semibold cursor-pointer transition ${
              activeTab === 'onboard' 
                ? 'bg-blue-600 font-bold text-white shadow-md' 
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {activeLanguage === 'AMH' ? 'ፍሪላንሰር ሁን' : 'Join as Freelancer'}
          </button>
        </div>

        {/* Dynamic Panel Frame */}
        <div className={`rounded-3xl border p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
          isDark 
            ? 'border-white/5 bg-slate-900/40 backdrop-blur-xl' 
            : 'border-slate-200 bg-white shadow-sm text-slate-800'
        }`}>
          
          <AnimatePresence mode="wait">
            {activeTab === 'feedback' ? (
              <motion.div
                key="feedback-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {feedbackSuccess ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {activeLanguage === 'AMH' ? 'አስተያየትዎ ተመዝግቧል!' : 'Feedback Recorded!'}
                    </h3>
                    <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                      {activeLanguage === 'AMH' ? 'ለቋንቋ ጥራት ደረጃ አስተዋፅኦ ስላደረጉ በታላቅ አክብሮት እናመሰግናለን።' : 'Thank you closely for contributing to precision-certified language metrics.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submitFeedback} className="space-y-6">
                    <h3 className={`text-lg sm:text-xl font-bold tracking-tight uppercase text-center border-b pb-4 ${
                      isDark ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'
                    }`}>
                      {activeLanguage === 'AMH' ? 'የፍሪላንሰር አስተያየት መስጫ' : 'Freelancer Feedback Panel'}
                    </h3>

                    {feedbackStep === 1 ? (
                      <div>
                        {/* Radio Poll */}
                        <p className={`text-sm sm:text-base font-medium mb-6 text-center ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {activeLanguage === 'AMH' ? 'ለስራው የተሰጡት መመሪያዎች ምን ያህል ግልጽ ነበሩ?' : 'How clear were the instructions given for the task?'}
                        </p>
                        
                        <div className="space-y-3 max-w-md mx-auto">
                          {ratingsOptions.map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                                instructionRating === opt 
                                  ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold' 
                                  : isDark 
                                    ? 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5'
                                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="radio"
                                name="instructions_poll"
                                value={opt}
                                checked={instructionRating === opt}
                                onChange={() => setInstructionRating(opt)}
                                className="accent-blue-500 w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </label>
                          ))}
                        </div>

                        <div className="flex justify-center mt-10">
                          <button
                            type="button"
                            onClick={() => setFeedbackStep(2)}
                            className={`px-6 py-3 rounded-full border text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer ${
                              isDark ? 'bg-slate-950 hover:bg-slate-900 border-white/10 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-350 text-slate-800'
                            }`}
                          >
                            <span>{activeLanguage === 'AMH' ? 'ቀጣይ ደረጃ' : 'Next Step'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-md mx-auto">
                        <p className={`text-xs font-semibold text-center uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {activeLanguage === 'AMH' ? 'ደረጃ 2፡ ማንነትዎን ያረጋግጡ' : 'Step 2: Authenticate Submit'}
                        </p>
                        
                        <div className="space-y-2">
                          <label className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                            {activeLanguage === 'AMH' ? 'የተርጓሚ ስም' : 'Linguist Name'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={activeLanguage === 'AMH' ? 'ስምዎን እዚህ ያስገቡ' : 'Your Name'}
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                              isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                            {activeLanguage === 'AMH' ? 'ዝርዝር የፕሮጀክት አስተያየቶች' : 'Detailed Project Comments'}
                          </label>
                          <textarea
                            rows={4}
                            placeholder={activeLanguage === 'AMH' ? 'ከየኛ ልሳን ጋር ያለዎትን የስራ ልምድ ያካፍሉ...' : 'Share your experience working with Yegna Lisan PLC...'}
                            value={projectFeedback}
                            onChange={(e) => setProjectFeedback(e.target.value)}
                            className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                              isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                            }`}
                          ></textarea>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <button
                            type="button"
                            onClick={() => setFeedbackStep(1)}
                            className="px-5 py-2.5 rounded-full hover:bg-black/5 text-xs text-slate-500 flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{activeLanguage === 'AMH' ? 'ተመለስ' : 'Back'}</span>
                          </button>

                          <button
                            type="submit"
                            disabled={submittingFeedback}
                            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-bold tracking-wide flex items-center gap-2 cursor-pointer text-white shadow-lg disabled:opacity-50"
                          >
                            {submittingFeedback ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                              <>
                                <span>{activeLanguage === 'AMH' ? 'አስገባ' : 'Record Poll'}</span>
                                <Send className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="onboard-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {appSuccess ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {activeLanguage === 'AMH' ? 'የባለሙያ ማመልከቻዎ ተቀብለናል!' : 'Linguist Auditing Review Initiated!'}
                    </h3>
                    <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                      {activeLanguage === 'AMH' ? 'የማመልከቻ መረጃዎ በትክክል ተቀምጧል። አስተዳዳሪዎቻችን ሰነዶችዎን ካረጋገጡ በኋላ በአጭር ጊዜ ያነጋግሩዎታል።' : 'Your experience parameters were filed. A manager will verify certification records.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submitOnboardApp} className="space-y-6">
                    <h3 className={`text-[16px] sm:text-lg font-bold tracking-tight uppercase text-center border-b pb-4 ${
                      isDark ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'
                    }`}>
                      {activeLanguage === 'AMH' ? 'የቋንቋ ባለሙያ ምዝገባ ቅጽ' : 'LINGUIST ONBOARDING FORM'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={`text-[10px] font-semibold uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                          {activeLanguage === 'AMH' ? 'ሙሉ ስም' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Dr. Merga Kenenisa"
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                            isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-semibold uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                          {activeLanguage === 'AMH' ? 'የኢሜል አድራሻ' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@yegnalisan.com"
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                            isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-semibold uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                          {activeLanguage === 'AMH' ? 'የስልክ ቁጥር' : 'Telephone Number'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251 9..."
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                            isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-semibold uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                          {activeLanguage === 'AMH' ? 'የትምህርት ደረጃ / ምስክር ወረቀቶች' : 'Academic Degrees / Qualifications'}
                        </label>
                        <input
                          type="text"
                          required
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          placeholder="MA in Linguistics, AAU"
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                            isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={`text-[10px] font-semibold uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                          {activeLanguage === 'AMH' ? 'የስራ ልምድ (በዓመት)' : 'Experience Years'}
                        </label>
                        <select
                          value={expYears}
                          onChange={(e) => setExpYears(e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                            isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-850'
                          }`}
                        >
                          <option value="1">{activeLanguage === 'AMH' ? 'ከ1-2 ዓመት' : '1-2 Years'}</option>
                          <option value="3">{activeLanguage === 'AMH' ? 'ከ3-5 ዓመት' : '3-5 Years'}</option>
                          <option value="6">{activeLanguage === 'AMH' ? 'ከ6-9 ዓመት' : '6-9 Years'}</option>
                          <option value="10">{activeLanguage === 'AMH' ? '10+ ዓመት (ከፍተኛ ባለሙያ)' : '10+ Years (Senior Expert)'}</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-semibold uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                          {activeLanguage === 'AMH' ? 'የስራ ማሳያ / የሊንክ አድራሻ (አማራጭ)' : 'Portfolio / CV Link (Optional)'}
                        </label>
                        <input
                          type="url"
                          value={pLink}
                          onChange={(e) => setPLink(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 border ${
                            isDark ? 'bg-slate-950/50 border-white/10 text-white' : 'bg-slate-50 border-slate-350 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Checkbox selections of languages */}
                    <div className="space-y-3">
                      <label className={`text-[10px] font-semibold uppercase font-mono block ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                        {activeLanguage === 'AMH' ? 'የካበቱባቸው የትርጉም ቋንቋዎች' : 'Ecosystem Languages Mastered'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["English", "Amharic", "Afaan Oromoo", "Tigrinya", "French", "German", "Somali", "Arabic"].map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleLanguageToggle(lang)}
                            className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                              languagesSelected.includes(lang)
                                ? 'bg-blue-600/25 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                                : isDark 
                                  ? 'bg-slate-950/30 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {activeLanguage === 'AMH' && lang === 'English' ? 'እንግሊዝኛ' :
                             activeLanguage === 'AMH' && lang === 'Amharic' ? 'አማርኛ' :
                             activeLanguage === 'AMH' && lang === 'Afaan Oromoo' ? 'ኦሮምኛ' :
                             activeLanguage === 'AMH' && lang === 'Tigrinya' ? 'ትግርኛ' :
                             activeLanguage === 'AMH' && lang === 'French' ? 'ፈረንሳይኛ' :
                             activeLanguage === 'AMH' && lang === 'German' ? 'ጀርመንኛ' :
                             activeLanguage === 'AMH' && lang === 'Somali' ? 'ሶማሊኛ' :
                             activeLanguage === 'AMH' && lang === 'Arabic' ? 'አረብኛ' : lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button
                        type="submit"
                        disabled={submittingApp}
                        className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer text-white shadow-lg shadow-blue-500/10 disabled:opacity-50"
                      >
                        {submittingApp ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <>
                            <span>{activeLanguage === 'AMH' ? 'ማመልከቻውን አስገባ' : 'Submit Application'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
