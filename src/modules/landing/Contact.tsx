/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Twitter, Facebook, Linkedin, SendToBack } from 'lucide-react';

interface ContactProps {
  activeTheme?: 'light' | 'dark';
  activeLanguage?: 'ENG' | 'AMH';
}

export default function Contact({ activeTheme = 'dark', activeLanguage = 'ENG' }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to file parameters.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (e: any) {
      setErr(e.message || 'Server communication error.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = activeTheme === 'dark';

  return (
    <section id="contact" className={`min-h-screen relative py-24 px-6 md:p-12 lg:px-24 transition-colors duration-300 scroll-mt-20 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-6xl w-full mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-blue-500 font-semibold tracking-widest uppercase mb-1">
            {activeLanguage === 'AMH' ? 'ያግኙን' : 'Get in Touch'}
          </span>
          <h2 className={`text-3xl sm:text-5xl font-sans font-black tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeLanguage === 'AMH' ? (
              <>የኛ ልሳንን <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ያነጋግሩ</span></>
            ) : (
              <>Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Yegna Lisan</span></>
            )}
          </h2>
          <p className={`text-xs sm:text-sm mt-4 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {activeLanguage === 'AMH' 
              ? 'ድርጅትዎን በሀገርኛ ቋንቋዎች ማቅረብ ይፈልጋሉ? ከታች ያለውን ቅጽ ይሙሉ ወይም በቀጥታ አዲስ አበባ ወደሚገኘው ቢሯችን ይደውሉ።' 
              : 'Ready to localize your business? Submit the contact form below or call our Addis Ababa agency directly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Borderless Contact Form (Left) */}
          <div className={`lg:col-span-7 rounded-3xl p-8 border backdrop-blur-md transition-colors duration-300 ${
            isDark ? 'bg-slate-900/35 border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-lg sm:text-xl font-bold font-sans tracking-tight mb-6 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {activeLanguage === 'AMH' ? 'ጥያቄዎን ይላኩልን' : 'Submit Inquiry'}
            </h3>
            
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-medium flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {activeLanguage === 'AMH' 
                    ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል! የቋንቋ ባለሙያዎቻችን በቅርቡ ምላሽ ይሰጡዎታል።' 
                    : 'Message submitted successfully! Our linguist officers will reply shortly.'}
                </span>
              </div>
            )}

            {err && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-medium">
                {err}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`relative group border-b focus-within:border-blue-500 transition-all ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 block">
                  {activeLanguage === 'AMH' ? 'ሙሉ ስም' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={activeLanguage === 'AMH' ? 'አለማየሁ ተሰማ' : 'Alemayehu Tessema'}
                  className={`w-full bg-transparent border-0 px-0 py-3 text-sm focus:outline-none focus:ring-0 mt-1 placeholder-slate-400 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              </div>

              <div className={`relative group border-b focus-within:border-blue-500 transition-all ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 block">
                  {activeLanguage === 'AMH' ? 'የኢሜል አድራሻ' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alemayehu@businessco.et"
                  className={`w-full bg-transparent border-0 px-0 py-3 text-sm focus:outline-none focus:ring-0 mt-1 placeholder-slate-400 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              </div>

              <div className={`relative group border-b focus-within:border-blue-500 transition-all ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 block">
                  {activeLanguage === 'AMH' ? 'ዝርዝር መልእክት' : 'Detailed Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeLanguage === 'AMH' ? 'ስለ ደოკუმንቱ መጠን፣ ቀነ-ገደብ እና ስለሚተረጎምበት ቀበሌኛ ያብራሩ...' : 'Tell us about your document size, deadlines, and target translation dialects...'}
                  className={`w-full bg-transparent border-0 px-0 py-3 text-sm focus:outline-none focus:ring-0 mt-1 placeholder-slate-400 resize-none ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-blue-500/10 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>{activeLanguage === 'AMH' ? 'የጥያቄ ቅጹን አስገባ' : 'Submit Translation Order'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Business Coordinates Information (Right) */}
          <div className="lg:col-span-5 space-y-8">
            <div className={`border rounded-3xl p-8 backdrop-blur-md space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-slate-900/35 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold font-sans tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeLanguage === 'AMH' ? 'አድራሻችን' : 'OUR ADDRESS'}
              </h3>
              
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-xl border text-blue-500 mt-0.5 ${
                    isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">
                      {activeLanguage === 'AMH' ? 'ዋና ቅጽበት አድራሻ (አዲስ አበባ)' : 'Addis Ababa Head Office'}
                    </h4>
                    <p className={`text-xs sm:text-sm leading-relaxed font-sans mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activeLanguage === 'AMH' 
                        ? 'አህመድ ቢዝነስ ሴንተር፣ 4ኛ ፎቅ፣ ቢሮ ቁጥር 430፣ ልደታ፣ አዲስ አበባ፣ ኢትዮጵያ።' 
                        : 'Ahmed Business Center, 4th Floor, Office No. 430 Lideta, Addis Ababa, Ethiopia.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-xl border text-blue-500 mt-0.5 ${
                    isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">
                      {activeLanguage === 'AMH' ? 'የስልክ ቁጥሮች' : 'Telephone Lines'}
                    </h4>
                    <p className={`text-xs sm:text-sm font-mono mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-705'}`}>
                      +251 975 108 198 ({activeLanguage === 'AMH' ? 'አስተዳደር' : 'Management'})<br />
                      +251 985 521 2899 ({activeLanguage === 'AMH' ? 'ድጋፍ' : 'Support'})<br />
                      +251 943 31 2767 ({activeLanguage === 'AMH' ? 'መረጃ' : 'Inquiries'})
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-xl border text-blue-500 mt-0.5 ${
                    isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">
                      {activeLanguage === 'AMH' ? 'ኢሜል አድራሻ' : 'E-mail Correspondence'}
                    </h4>
                    <p className={`text-xs sm:text-sm font-mono mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      support@yegnalisan.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-xl border text-blue-500 mt-0.5 ${
                    isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">
                      {activeLanguage === 'AMH' ? 'የስራ ሰዓታት' : 'Business Hours'}
                    </h4>
                    <p className={`text-xs sm:text-sm font-sans mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activeLanguage === 'AMH' 
                        ? 'ከሰኞ – አርብ: ከጠዋቱ 2:30 – ከሰዓት 11:00 (የምስራቅ አፍሪካ ሰዓት አቆጣጠር)' 
                        : 'Monday – Friday: 8:30 AM – 5:00 PM (EAT)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className={`border rounded-3xl p-6 backdrop-blur-md flex items-center justify-between transition-colors duration-300 ${
              isDark ? 'bg-slate-900/35 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className={`text-[10px] uppercase font-mono font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeLanguage === 'AMH' ? 'ማህበራዊ ገጾቻችን፡' : 'We are social:'}
              </span>
              <div className="flex gap-3">
                <a href="#" className={`p-2 rounded-xl border transition ${
                  isDark ? 'bg-slate-950 hover:bg-slate-900 border-white/5 text-slate-400 hover:text-blue-400' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-blue-500'
                }`}>
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className={`p-2 rounded-xl border transition ${
                  isDark ? 'bg-slate-950 hover:bg-slate-900 border-white/5 text-slate-400 hover:text-blue-500' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-blue-600'
                }`}>
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className={`p-2 rounded-xl border transition ${
                  isDark ? 'bg-slate-950 hover:bg-slate-900 border-white/5 text-slate-400 hover:text-blue-400' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-blue-600'
                }`}>
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className={`p-2 rounded-xl border transition ${
                  isDark ? 'bg-slate-950 hover:bg-slate-900 border-white/5 text-slate-400 hover:text-indigo-400' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-indigo-650'
                }`}>
                  <SendToBack className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className={`mt-20 pt-8 border-t text-xs font-sans flex items-center justify-between ${
          isDark ? 'border-white/5 text-slate-600' : 'border-slate-200 text-slate-400'
        }`}>
          <span>
            {activeLanguage === 'AMH' 
              ? 'የቅጂ መብት © 2026 የኛ ልሳን ትራንስሌሽን። መብቱ በህግ የተጠበቀ ነው። የተረጋገጠ ህጋዊ ትርጉም ስነ-ምህዳር።' 
              : 'Copyright © 2026 YEGNA LISAN PLC. All rights reserved.'}
          </span>
          <span className="text-right">
            {activeLanguage === 'AMH' 
              ? 'በእስራኤል ስዩም የተሰራ' 
              : 'Developed By Israel Seyoum'}
          </span>
        </div>
      </div>
    </section>
  );
}
