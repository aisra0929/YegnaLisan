/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { BookOpen, Mic, RefreshCw, AudioLines, Award, GraduationCap, CheckCircle2 } from 'lucide-react';

interface ServiceItem {
  id: number;
  title: string;
  ethTitle: string;
  desc: string;
  icon: any;
  span: string;
  color: string;
}

const servicesList: ServiceItem[] = [
  {
    id: 1,
    title: "Document Translation",
    ethTitle: "የሰነድ ትርጉም",
    desc: "Rigorous high-fidelity translations of Legal, Medical, Academic, Business, and Technical blueprints. Certified by sworn experts for embassy and government submissions.",
    icon: BookOpen,
    span: "lg:col-span-2 md:col-span-2",
    color: "from-blue-500/10 to-transparent"
  },
  {
    id: 2,
    title: "Interpretation",
    ethTitle: "የቃል ትርጉም",
    desc: "Seamless consecutive and simultaneous interpretation for global summits, state delegate panels, courtroom proceedings, and trade meetings.",
    icon: Mic,
    span: "lg:col-span-1 md:col-span-1",
    color: "from-indigo-500/10 to-transparent"
  },
  {
    id: 3,
    title: "Transcription",
    ethTitle: "ድምፅ ተኮር ፅሁፍ",
    desc: "Precise transcription of vernacular audio and video files into timestamps with high linguistic precision and formatting.",
    icon: AudioLines,
    span: "lg:col-span-1 md:col-span-1",
    color: "from-purple-500/10 to-transparent"
  },
  {
    id: 4,
    title: "Multilingual Support",
    ethTitle: "የደንበኞች አገልግሎት",
    desc: "Custom multilingual customer care agents configured with local dialect precision to bridge gaps for international organizations operating inside East Africa.",
    icon: Award,
    span: "lg:col-span-2 md:col-span-2",
    color: "from-cyan-500/10 to-transparent"
  },
  {
    id: 5,
    title: "Editing & Proofreading",
    ethTitle: "ክለሳና እርማት",
    desc: "Professional double-blind peer editing to refine tone, spelling, grammatical elegance, and localized flow of finished translations.",
    icon: RefreshCw,
    span: "lg:col-span-1",
    color: "from-fuchsia-500/10 to-transparent"
  },
  {
    id: 6,
    title: "Expert Consultation",
    ethTitle: "የቋንቋ አማካሪነት",
    desc: "Empower corporate plans with specialized language consulting, dialect strategies, localization roadmaps, and project structures.",
    icon: GraduationCap,
    span: "lg:col-span-2",
    color: "from-emerald-500/10 to-transparent"
  }
];

interface ServicesProps {
  activeTheme?: 'light' | 'dark';
  activeLanguage?: 'ENG' | 'AMH';
}

export default function Services({ activeTheme = 'dark', activeLanguage = 'ENG' }: ServicesProps) {
  const isDark = activeTheme === 'dark';

  return (
    <section id="services" className={`min-h-screen relative py-24 px-6 md:p-12 lg:px-24 transition-colors duration-300 scroll-mt-20 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-blue-500 font-semibold tracking-widest uppercase">
            {activeLanguage === 'AMH' ? 'የትርጉም አገልግሎት ዓይነቶች' : 'Ecosystem Capabilities'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight mt-3">
            {activeLanguage === 'AMH' ? (
              <>ስለ እኛ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ይወቁ</span></>
            ) : (
              <>Get to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">KNOW US</span></>
            )}
          </h2>
          <p className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {activeLanguage === 'AMH' 
              ? 'ለአለም አቀፍ ተቋማት እና በአገር ውስጥ ላሉ ድርጅቶች የምናቀርባቸውን አስተማማኝ እና ጥራት ያላቸው የቋንቋ አገልግሎቶችን ይመልከቱ።' 
              : 'Explore our state-of-the-art language architectures designed to bring uncompromised local accuracy to global organizations.'}
          </p>
        </div>

        {/* Apple Style Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.id}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`${svc.span} group relative rounded-3xl border transition-colors duration-300 p-8 overflow-hidden ${
                  isDark 
                    ? 'border-white/5 bg-slate-900/40 backdrop-blur-xl hover:border-white/10 text-white' 
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow text-slate-800'
                }`}
              >
                {/* Micro Ambient Radial Background Glow */}
                <div className={`absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-br ${svc.color} rounded-full blur-3xl opacity-20 group-hover:opacity-60 transition duration-500`}></div>

                {/* Service Icon */}
                <div className={`inline-flex p-3.5 rounded-2xl border text-blue-500 mb-6 group-hover:text-blue-600 ${
                  isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-100'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Titles */}
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <h3 className={`text-xl font-semibold tracking-tight font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeLanguage === 'AMH' ? svc.ethTitle : svc.title}
                  </h3>
                  <span className="text-xs font-sans text-slate-500 font-medium">
                    {activeLanguage === 'AMH' ? svc.title : svc.ethTitle}
                  </span>
                </div>

                {/* Description */}
                <p className={`text-xs sm:text-sm font-sans leading-relaxed max-w-xl transition ${
                  isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-650 group-hover:text-slate-800'
                }`}>
                  {activeLanguage === 'AMH' && svc.id === 1 ? 'ለህግ፣ ለህክምና፣ ለአካዳሚክ፣ ለንግድ እና ለቴክኒክ ንድፎች ጥብቅ ባለ ከፍተኛ ትክክለኝነት የሰነድ ትርጉም። ለኤምባሲ እና ለរដ្ឋ ማመልከቻዎች በልዩ ተርጓሚዎች የተረጋገጠ።' :
                   activeLanguage === 'AMH' && svc.id === 2 ? 'ለአለም አቀፍ ስብሰባዎች ፣ ለስቴት ተወካዮች ፓነሎች ፣ ፍርድ ቤቶች እና የንግድ ስብሰባዎች እንከን የለሽ ተከታታይ እና በአንድ ጊዜ የቃል ትርጉም አገልግሎት።' :
                   activeLanguage === 'AMH' && svc.id === 3 ? 'የድምጽ እና የቪዲዮ ፋይሎችን በከፍተኛ የቋንቋ ትክክለኛነት እና ፎርማት ወደ ጽሁፍ መለወጥ።' :
                   activeLanguage === 'AMH' && svc.id === 4 ? 'በምስራቅ አፍሪካ ውስጥ ለሚንቀሳቀሱ አለም አቀፍ ድርጅቶች ክፍተቶችን ለመሙላት በአገር ውስጥ ቀበሌኛ ትክክለኛነት የተዘጋጁ የደንበኞች አገልግሎት ድጋፍ።' :
                   activeLanguage === 'AMH' && svc.id === 5 ? 'የተጠናቀቁ ትርጉሞችን ቃና፣ ሆሄያት፣ ሰዋሰዋዊ ውበት እና የአካባቢ ፍሰት ለማሻሻል ሙያዊ ድርብ-እውር የአቻ ክለሳ ስራ።' :
                   activeLanguage === 'AMH' && svc.id === 6 ? 'የድርጅት እቅዶችን በልዩ የቋንቋ አማካሪነት ፣ የቀበሌኛ ስልቶች ፣ የትርጉም ካርታዎች እና የፕሮጀክት መዋቅሮችን ማገዝ።' : svc.desc}
                </p>

                {/* Visual Status Indicator in 2026 styles */}
                <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-mono ${
                  isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-450'
                }`}>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> 
                    {activeLanguage === 'AMH' ? 'በሰው የተረጋገጠ' : 'Human Expert Audited'}
                  </span>
                  <span>{activeLanguage === 'AMH' ? 'ከፍተኛ ጥራት' : 'Premium Standard'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
