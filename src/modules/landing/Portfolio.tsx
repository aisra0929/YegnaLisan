/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Landmark, Scale, Building2, FlameKindling, Globe2, BarChart3 } from 'lucide-react';

interface PortfolioProps {
  activeTheme?: 'light' | 'dark';
  activeLanguage?: 'ENG' | 'AMH';
}

export default function Portfolio({ activeTheme = 'dark', activeLanguage = 'ENG' }: PortfolioProps) {
  const isDark = activeTheme === 'dark';

  return (
    <section id="portfolio" className={`min-h-screen relative py-24 px-6 md:p-12 lg:px-24 transition-colors duration-300 scroll-mt-20 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-blue-500 font-semibold tracking-widest uppercase">
            {activeLanguage === 'AMH' ? 'የትኩረት ዘርፎች እና ደንበኞች' : 'Target Sectors & Portfolio'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight mt-3">
            {activeLanguage === 'AMH' ? (
              <>የምንኮራባቸው <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ደንበኞቻችን</span></>
            ) : (
              <>Our Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">CLIENTS</span></>
            )}
          </h2>
          <p className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {activeLanguage === 'AMH' 
              ? 'መከላከያን፣ ከፍተኛ ፍርድ ቤቶችን እና በምስራቅ አፍሪካ የሚገኙ አለም አቀፍ ድርጅቶችን በታማኝነት እናገለግላለን።' 
              : 'Serving national defense pillars, supreme court counsels, and international organizations throughout the Horn of Africa.'}
          </p>
        </div>

        {/* Apple Style Bento Grid for Portfolio Sectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Cell 1: Law Firms (Large highlight) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`md:col-span-7 rounded-3xl border transition-colors duration-300 p-8 relative overflow-hidden group ${
              isDark 
                ? 'border-white/5 bg-slate-900/35 backdrop-blur-xl hover:border-white/10 text-white' 
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-15 transition">
              <Scale className="w-40 h-40 text-blue-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className={`inline-flex p-3 rounded-2xl border text-blue-500 mb-6 ${
                  isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
                }`}>
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className={`text-2xl font-bold font-sans tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeLanguage === 'AMH' ? 'የህግ ማህበራት' : 'Law Firms'}
                </h3>
                <p className={`text-xs sm:text-sm font-sans leading-relaxed max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeLanguage === 'AMH' 
                    ? 'ሙሉ በሙሉ የተረጋገጡ ትራንስክሪፕቶች፣ የጋራ ማህበር ውሎች፣ የፓተንት ማመልከቻዎች፣ ሙግቶች እና የድርጅት ሰነዶች። የታመኑ ፍርድ ቤት ተርጓሚዎች ከፌደራል ፍርድ ቤት ደንቦች ጋር መስማማታቸውን ያረጋግጣሉ።' 
                    : 'Delivering fully certified transcripts, joint venture contracts, patent applications, litigation proceedings, and corporate charters. Sworn court translators assure compliance with Ethiopian Federal Court protocols.'}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200/45 dark:border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                <span className={`px-2 py-1 rounded-lg border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  {activeLanguage === 'AMH' ? 'በፌደራል ፍርድ ቤት የተረጋገጠ' : 'Federal Sworn Certified'}
                </span>
                <span className={`px-2 py-1 rounded-lg border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  {activeLanguage === 'AMH' ? 'በሚስጥር የተጠበቀ' : 'NDA Protected'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bento Cell 2: Government Offices */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`md:col-span-5 rounded-3xl border transition-colors duration-300 p-8 relative overflow-hidden group ${
              isDark 
                ? 'border-white/5 bg-slate-900/35 backdrop-blur-xl hover:border-white/10 text-white' 
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-15 transition">
              <Landmark className="w-32 h-32 text-indigo-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className={`inline-flex p-3 rounded-2xl border text-indigo-500 mb-6 ${
                  isDark ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-indigo-55 border-indigo-100'
                }`}>
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className={`text-2xl font-bold font-sans tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeLanguage === 'AMH' ? 'መንግስት እና ኤምባሲዎች' : 'Government & Embassies'}
                </h3>
                <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeLanguage === 'AMH' 
                    ? 'የክልል ሚኒስቴሮች ፣ ዲፕሎማሲያዊ ግንኙነቶች ፣ የሁለትዮሽ ፕሮቶኮሎች ፣ የንግድ ስምምነቶች እና የስደት ማህደሮች ትርጉም አፈፃፀም።' 
                    : 'Executing translations for regional ministries, diplomatic communiqués, bilateral protocols, trade agreements, and immigration archives.'}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200/45 dark:border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                <span className={`px-2 py-1 rounded-lg border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  {activeLanguage === 'AMH' ? 'በሚኒስቴር የታወቀ' : 'Ministry Approved'}
                </span>
                <span className={`px-2 py-1 rounded-lg border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  {activeLanguage === 'AMH' ? 'ደህንነቱ አስተማማኝ' : 'Secure Clearance'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bento Cell 3: Multi-national Corporate Conglomerates */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`md:col-span-4 rounded-3xl border transition-colors duration-300 p-8 relative overflow-hidden group ${
              isDark 
                ? 'border-white/5 bg-slate-900/35 backdrop-blur-xl hover:border-white/10 text-white' 
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-15 transition">
              <Building2 className="w-32 h-32 text-cyan-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className={`inline-flex p-3 rounded-2xl border text-cyan-500 mb-6 ${
                  isDark ? 'bg-cyan-600/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-100'
                }`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold font-sans tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeLanguage === 'AMH' ? 'አለም አቀፍ ኩባንያዎች' : 'Global Companies'}
                </h3>
                <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeLanguage === 'AMH' 
                    ? 'የሶፍትዌር በይነገጾችን ፣ የሂሳብ አያያዝ ሰነዶችን ፣ የቴክኒክ ማኑዋሎችን ፣ እና የግብይት እቅዶችን ወደ ባህላዊ የአፍሪካ ቋንቋዎች መለወጥ።' 
                    : 'Localizing software interfaces, financial audit prospectuses, technical manuals, employee guides, and marketing blueprints into Horn language branches.'}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200/45 dark:border-white/5">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">SEC Compiles Approved</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Cell 4: Performance Analytics & Quality metrics (Large stat row) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`md:col-span-8 rounded-3xl border transition-colors duration-300 p-8 relative overflow-hidden group ${
              isDark 
                ? 'border-white/5 bg-slate-900/35 backdrop-blur-xl hover:border-white/10 text-white' 
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 h-full items-center">
              <div>
                <div className={`inline-flex p-3 rounded-2xl border text-emerald-500 mb-4 ${
                  isDark ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
                }`}>
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold font-sans tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeLanguage === 'AMH' ? 'የስራ ክንውኖች' : 'Our Performance Stats'}
                </h3>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {activeLanguage === 'AMH' 
                    ? 'በሙያዊ የትርጉም ደረጃዎች መሰረት የሚደረጉ ጥብቅ ቁጥጥሮች ከስህተት የጸዳ ጥራትን ያረጋግጣሉ።' 
                    : 'Rigorous audits under professional translation standards assure zero-defect deliveries.'}
                </p>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-250/50'}`}>
                  <p className="text-[9px] font-semibold text-slate-550 uppercase tracking-widest font-mono">
                    {activeLanguage === 'AMH' ? 'የጥራት ተቀባይነት' : 'Acceptance Score'}
                  </p>
                  <p className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>99.84%</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                    <div className="bg-emerald-505 bg-gradient-to-r from-emerald-500 to-teal-500 h-1 rounded-full w-[99.8%]"></div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-250/50'}`}>
                  <p className="text-[9px] font-semibold text-slate-550 uppercase tracking-widest font-mono">
                    {activeLanguage === 'AMH' ? 'አስቸኳይ አቅርቦት' : 'Express Delivery'}
                  </p>
                  <p className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{"< 4 Hours"}</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                    <div className="bg-blue-500 h-1 rounded-full w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
