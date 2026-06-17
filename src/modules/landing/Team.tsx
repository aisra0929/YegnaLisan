/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Briefcase, Award, Languages, Star } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  desc: string;
  gradient: string;
  stats: { label: string; val: string }[];
  languages: string[];
  avatarUrl?: string;
  avatarResolved?: string;
}

const teamList: TeamMember[] = [
  {
    id: 1,
    name: "AMAN ZEWDIE",
    role: "General Manager",
    desc: "Spearheading strategic management, external partnerships, and enterprise translations QA control protocols.",
    gradient: "from-blue-600 to-indigo-600",
    languages: ["Amharic", "English", "Tigrinya"],
    stats: [
      { label: "Experience", val: "12+ Yrs" },
      { label: "Audits", val: "2,400+" }
    ]
  },
  {
    id: 2,
    name: "NAHOM NADEW",
    role: "Deputy General Manager",
    desc: "Overseeing operations, workflow automation, and specialized technology/engineering translations accuracy.",
    gradient: "from-cyan-600 to-blue-600",
    languages: ["Amharic", "English", "Oromo"],
    stats: [
      { label: "Experience", val: "10+ Yrs" },
      { label: "Projects", val: "1,800+" }
    ]
  },
  {
    id: 3,
    name: "ZEREYAKOB ZEWDIE",
    role: "Finance Head",
    desc: "Directing financial structures, freelancer payroll distribution, global project billing, and fiscal modeling.",
    gradient: "from-purple-600 to-indigo-600",
    languages: ["Amharic", "English"],
    stats: [
      { label: "Experience", val: "14+ Yrs" },
      { label: "Contracts", val: "140+" }
    ]
  },
  {
    id: 4,
    name: "YEADONAY HAILU",
    role: "Translator & Administrator",
    desc: "Specialized in Legal agreements research, corporate documents coordination, and liaison for translation workflow schedules.",
    gradient: "from-teal-600 to-emerald-600",
    languages: ["Amharic", "English", "Somali"],
    stats: [
      { label: "Experience", val: "8 Yrs" },
      { label: "Coordinated", val: "3,200+" }
    ]
  }
];

interface TeamProps {
  activeTheme?: 'light' | 'dark';
  activeLanguage?: 'ENG' | 'AMH';
}

export default function Team({ activeTheme = 'dark', activeLanguage = 'ENG' }: TeamProps) {
  const isDark = activeTheme === 'dark';
  const [team, setTeam] = useState<TeamMember[]>(teamList);

  useEffect(() => {
    const loadImage = (url: string) => {
      return new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const resolveAvatars = async (items: TeamMember[]) => {
      return Promise.all(items.map(async (m) => {
        const candidates: string[] = [];
        if (m.avatarUrl) candidates.push(m.avatarUrl);

        const slug = m.name.split(' ')[0].toLowerCase();
        // try common extensions and both absolute and relative paths
        const exts = ['jpg', 'jpeg', 'png', 'webp'];
        for (const ext of exts) {
          candidates.push(`/assets/images/${slug}.${ext}`);
          candidates.push(`assets/images/${slug}.${ext}`);
          candidates.push(`/src/assets/images/${slug}.${ext}`);
        }

        for (const url of candidates) {
          try {
            const ok = await loadImage(url);
            if (ok) {
              return { ...m, avatarResolved: url } as TeamMember;
            }
          } catch (e) {
            // continue to next candidate
          }
        }

        return { ...m, avatarResolved: undefined } as TeamMember;
      }));
    };

    (async () => {
      try {
        const res = await fetch('/api/team');
        if (!res.ok) throw new Error('Fallback code active');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const resolved = await resolveAvatars(data);
          setTeam(resolved);
        }
      } catch (e) {
        // keep default teamList (initials)
      }
    })();
  }, []);

  return (
    <section id="team" className={`min-h-screen relative py-24 px-6 md:p-12 lg:px-24 transition-colors duration-300 scroll-mt-20 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Title Block */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-blue-500 font-semibold tracking-widest uppercase">
            {activeLanguage === 'AMH' ? 'የቋንቋ ባለሙያዎች ቡድን' : 'Linguistic Specialists'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight mt-3 uppercase text-balance">
            {activeLanguage === 'AMH' ? (
              <>የኛ ልሳን <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ቡድን</span></>
            ) : (
              <>Yegna Lisan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Team</span></>
            )}
          </h2>
          <p className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto font-sans ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
            {activeLanguage === 'AMH' 
              ? 'በአዲስ አበባ እና በዓለም አቀፍ ደረጃ ጥራቱን የጠበቀ አገልግሎት የሚሰጡ የተረጋገጡ ባለሙያዎቻችን።' 
              : 'Our verified native translation managers and specialized language heads operating in East Africa.'}
          </p>
        </div>

        {/* Profiles Grid - Inspired by clean testimonial row cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <motion.div
              key={m.id}
              whileHover={{ y: -8 }}
              className={`rounded-3xl border p-6 text-center shadow-xl transition-all duration-300 flex flex-col items-center justify-between group ${
                isDark 
                  ? 'border-white/5 bg-slate-900/40 backdrop-blur-xl text-white hover:border-blue-500/30' 
                  : 'border-slate-200 bg-white text-slate-800 hover:border-blue-600/30'
              }`}
            >
              {/* Top Section - Image Centered in a Circle */}
              <div className="flex flex-col items-center w-full">
                <div className="relative w-24 h-24 rounded-full border border-blue-500/10 bg-slate-950 flex items-center justify-center overflow-hidden mb-6 shadow-md shadow-blue-500/5 group">
                  {m.avatarResolved ? (
                    <img 
                      src={m.avatarResolved} 
                      alt={m.name} 
                      className="w-full h-full object-cover object-top transition duration-550 hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-20`}></div>
                      <span className="relative font-mono font-black text-xl text-blue-400">
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </>
                  )}
                </div>

                {/* Name */}
                <h3 className={`text-base font-black font-sans tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {m.name}
                </h3>

                {/* Role */}
                <span className="text-[10px] font-mono tracking-widest text-blue-500 font-bold uppercase mt-1">
                  {activeLanguage === 'AMH' && m.id === 1 ? 'ዋና ዳይሬክተር' :
                   activeLanguage === 'AMH' && m.id === 2 ? 'ምክትል ዋና ዳይሬክተር' :
                   activeLanguage === 'AMH' && m.id === 3 ? 'የፋይናንስ ኃላፊ' :
                   activeLanguage === 'AMH' && m.id === 4 ? 'ተርጓሚ እና አስተዳዳሪ' : m.role}
                </span>

                {/* 5 Rating Stars - Elegant UI/UX Inspiration addition */}
                <div className="flex items-center gap-1 my-3 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                  ))}
                </div>

                {/* Divider Line */}
                <div className="w-12 h-[1px] bg-slate-500/20 my-4"></div>

                {/* Testimonial/Description Text */}
                <p className={`text-xs font-sans leading-relaxed min-h-[64px] px-2 ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                  {activeLanguage === 'AMH' && m.id === 1 ? 'ስልታዊ አመራርን ፣ የውጭ ግንኙነቶችን እና የድርጅት ትርጉሞች የጥራት ቁጥጥር ፕሮቶኮሎችን መምራት።' :
                   activeLanguage === 'AMH' && m.id === 2 ? 'ክዋኔዎችን ፣ የስራ ፍሰት አውቶማቲክን እና የቴክኖሎጂ / ምህንድስና ትርጉሞችን ትክክለኛነት መቆጣጠር።' :
                   activeLanguage === 'AMH' && m.id === 3 ? 'የፋይናንስ መዋቅሮችን ፣ የፍሪላንሰር ክፍያዎችን ፣ አጠቃላይ የፕሮጀክት ክፍያዎችን እና የሂሳብ አያያዝን መምራት።' :
                   activeLanguage === 'AMH' && m.id === 4 ? 'በህጋዊ ስምምነቶች ምርምር ፣ በኮርፖሬት ሰነዶች ማጠቃለያ እና በትርጉም የስራ ፍሰት ቅንጅት ላይ የተሰማራ።' : m.desc}
                </p>
              </div>

              {/* Bottom Section - Stats Block & Languages */}
              <div className="w-full mt-6 space-y-4">
                {/* Years Experience & Volume Stats */}
                <div className={`grid grid-cols-2 gap-2 p-3 rounded-2xl ${
                  isDark ? 'border border-white/5 bg-slate-950/40 text-white' : 'border border-slate-100 bg-slate-50 text-slate-850'
                }`}>
                  {m.stats.map((s, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-[9px] uppercase font-mono tracking-wider font-semibold text-slate-500">
                        {activeLanguage === 'AMH' && s.label === 'Experience' ? 'ልምድ' :
                         activeLanguage === 'AMH' && s.label === 'Audits' ? 'ቁጥጥር' :
                         activeLanguage === 'AMH' && s.label === 'Projects' ? 'ፕሮጀክቶች' :
                         activeLanguage === 'AMH' && s.label === 'Contracts' ? 'ኮንትራቶች' :
                         activeLanguage === 'AMH' && s.label === 'Coordinated' ? 'የተቀናጁ' : s.label}
                      </p>
                      <p className={`text-xs font-bold font-mono mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activeLanguage === 'AMH' && s.val.includes('Yrs') ? s.val.replace('Yrs', 'ዓመት') : s.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Languages Supported */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {m.languages.map((l, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 text-[9px] rounded font-medium border ${
                        isDark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-250/65 text-slate-600'
                      }`}
                    >
                      {activeLanguage === 'AMH' && l === 'Amharic' ? 'አማርኛ' :
                       activeLanguage === 'AMH' && l === 'English' ? 'እንግሊዝኛ' :
                       activeLanguage === 'AMH' && l === 'Tigrinya' ? 'ትግርኛ' :
                       activeLanguage === 'AMH' && l === 'Oromo' ? 'ኦሮምኛ' :
                       activeLanguage === 'AMH' && l === 'Somali' ? 'ሶማሊኛ' : l}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
