/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Languages, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface HeroProps {
  onStart: (role?: UserRole) => void;
  activeTheme?: 'light' | 'dark';
  activeLanguage?: 'ENG' | 'AMH';
}

export default function Hero({ onStart, activeTheme = 'dark', activeLanguage = 'ENG' }: HeroProps) {
  // Rotating texts for Typewriter Animation
  const rotatingTexts = activeLanguage === 'AMH' ? [
    "ፈጣን የትርጉም አገልግሎት",
    "የአማርኛ ↔ እንግሊዝኛ ባለሙያዎች",
    "ሙያዊ የሰነድ ትርጉም"
  ] : [
    "Fast Translation Services",
    "Amharic ↔ English Experts",
    "Professional Document Translation"
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const currentFullText = rotatingTexts[textIndex] || "";
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setTypedText(prev => currentFullText.slice(0, prev.length + 1));
      }, 80);
    }

    if (!isDeleting && typedText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 2500); // Hold before backspace
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setTextIndex(prev => (prev + 1) % rotatingTexts.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, textIndex, activeLanguage]);

  const isDark = activeTheme === 'dark';

  return (
    <section id="home" className={`min-h-screen relative flex items-center justify-center p-6 md:p-12 overflow-hidden transition-colors duration-300 select-none ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 2026 Cosmic Slate / Light Blue glow gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] ${
          isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'
        }`}></div>
        <div className={`absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] ${
          isDark ? 'bg-indigo-500/5' : 'bg-indigo-500/5'
        }`}></div>
        
        {/* Fine grid overlay */}
        <div className={`absolute inset-0 bg-[size:32px_32px] ${
          isDark 
            ? 'bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)]'
        }`}></div>
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Core Typography Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-7.5xl font-sans font-black tracking-tight leading-tight uppercase text-balance mt-6"
        >
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-2 block">
            {activeLanguage === 'AMH' ? 'የኛ ልሳን' : 'Yegna Lisan'}
          </span>
        </motion.h1>

        {/* --- Rotating Text (Typewriter animation effect) --- */}
        <div className="h-12 mt-6 flex items-center justify-center">
          <span className="text-xl sm:text-3xl font-bold font-sans text-blue-600 dark:text-blue-400 min-h-[30px] border-r-2 border-blue-500 animate-pulse pr-1">
            {typedText}
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`text-base sm:text-xl font-light tracking-wide mt-2 max-w-2xl font-sans ${isDark ? 'text-slate-400' : 'text-slate-550'}`}
        >
          {activeLanguage === 'AMH' ? 'የትርጉም ሥራ ኃ/የተ/የግ/ ማኅበር' : 'Translation PLC • የትርጉም ሥራ ኃ/የተ/የግ/ ማኅበር'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-slate-500 max-w-3xl mt-6 font-sans text-balance leading-relaxed text-xs sm:text-sm`}
        >
          {activeLanguage === 'AMH' 
            ? 'የኢትዮጵያን የበለፀጉ የቋንቋ ሀብቶች ከአለም አቀፍ ደረጃ ጋር እናገናኛለን። ልምድ ያላቸው የተረጋገጡ የህግ፣ የህክምና፣ የድርጅት እና አለም አቀፍ የሰነድ ትርጉም ባለሙያዎች ከፈጣን ዲጂታል የክትትል መስመሮች ጋር።' 
            : 'Connecting Ethiopia’s rich language assets globally. Experienced certified specialists paired with dynamic digital pipelines for Legal, Medical, Corporate, and International content translation.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <button
            onClick={() => onStart()}
            className="group relative px-8 py-3.5 w-60 sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <span>{activeLanguage === 'AMH' ? 'ግባ / ተመዝገብ' : 'GET STARTED'}</span>
            <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
          </button>

          <a
            href="#services"
            className={`px-8 py-3.5 w-60 sm:w-auto rounded-full border text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              isDark 
                ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-900'
            }`}
          >
            <span>{activeLanguage === 'AMH' ? 'አገልግሎቶቻችንን እይ' : 'DISCOVER SERVICES'}</span>
          </a>
        </motion.div>

        {/* Status Trust metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 rounded-3xl p-6 mt-16 max-w-4xl w-full backdrop-blur-md border ${
            isDark ? 'bg-slate-950/40 border-slate-900/80 text-white' : 'bg-white/80 border-slate-200/60 text-slate-900 shadow'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight">35M+</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
              {activeLanguage === 'AMH' ? 'የተተረጎሙ ቃላት' : 'Translated Words'}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-tight">100%</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
              {activeLanguage === 'AMH' ? 'ህጋዊ ተአማኒነት' : 'Legal Compliant'}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight">45+</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
              {activeLanguage === 'AMH' ? 'የቋንቋ ባለሙያዎች' : 'Linguists Guild'}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">12+</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
              {activeLanguage === 'AMH' ? 'አለም አቀፍ ዘርፎች' : 'Global Sectors'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
