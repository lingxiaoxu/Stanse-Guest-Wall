
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, Briefcase, Coffee, Quote, Edit3, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Guest } from './GuestCard';
import { API_ENDPOINTS, TRANSLATIONS, Language } from '../constants';

interface GeminiModalProps {
  guest: Guest;
  onClose: () => void;
  lang: Language;
}

interface AnalysisData {
  title: string;
  personality: string;
  career: string;
  lifestyle: string;
  summary: string;
}

// Correction Workflow States
type CorrectionStep = 'idle' | 'verify' | 'input';

export const GeminiModal: React.FC<GeminiModalProps> = ({ guest, onClose, lang }) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Correction State
  const [correctionStep, setCorrectionStep] = useState<CorrectionStep>('idle');
  const [manualInput, setManualInput] = useState('');
  const [hasUserCorrection, setHasUserCorrection] = useState(false);

  const t = TRANSLATIONS[lang];
  const abortControllerRef = useRef<AbortController | null>(null);

  // Proxy image logic
  const imageUrl = guest.avatarUrl.startsWith('http') && !guest.avatarUrl.includes('picsum')
    ? `${API_ENDPOINTS.PROXY_IMAGE}?url=${encodeURIComponent(guest.avatarUrl)}`
    : guest.avatarUrl;

  const fetchAnalysis = async (userInput?: string) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    // Only clear data on initial load to avoid UI jumping, unless refining
    if (!userInput && !data) setData(null);

    try {
       // Set a timeout for the fetch to avoid hanging indefinitely
       const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

       // Attempt Real API Call first
       const response = await fetch(API_ENDPOINTS.GEMINI, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               handle: guest.handle,
               bio: guest.bio,
               lang: lang,
               manualInput: userInput || null
           }),
           signal: controller.signal
       });
       
       clearTimeout(timeoutId);

       // Check if response is valid JSON
       const result = await response.json().catch(() => ({ success: false }));

       if (response.ok && result.success && result.analysis) {
           try {
               const parsed = JSON.parse(result.analysis);
               setData(parsed);
               if (userInput) {
                   setHasUserCorrection(true);
                   setCorrectionStep('idle');
               }
               return; // Exit on success
           } catch (e) {
               console.warn("JSON Parse error", e);
               // Fallthrough to mock
           }
       }
       
       // If we reach here, API failed or returned error, throw to catch block
       throw new Error("API unavailable or failed");

    } catch (error: any) {
      if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
      }
      console.warn("API Error, using fallback mock data:", error);
      
      // --- Fallback Mock Logic ---
      await new Promise(r => setTimeout(r, 1000)); // Simulate processing delay
      
      const isPrivate = (!guest.bio || guest.bio.length < 5) && !userInput;

      if (isPrivate) {
         setData({
             title: t.unknown,
             personality: t.unknown,
             career: t.unknown,
             lifestyle: t.unknown,
             summary: "..."
         });
      } else {
          // Localized Mock Data
          if (lang === 'zh') {
              setData({
                  title: userInput ? "用户已核验身份" : "赛博极简主义者",
                  personality: userInput ? `基于输入: ${userInput.substring(0, 10)}...` : "内敛，追求极致的秩序感。",
                  career: userInput ? "已更新职业信息" : "大概率是设计师或创意总监。",
                  lifestyle: "只喝黑咖啡，喜欢黑白滤镜。",
                  summary: "为了简介里那个句号能纠结半小时的完美主义者。"
              });
          } else {
              setData({
                  title: userInput ? "Verified User" : "Digital Minimalist",
                  personality: userInput ? `Based on: ${userInput.substring(0, 10)}...` : "Reserved, seeking absolute order.",
                  career: userInput ? "Updated Career Info" : "Likely a Designer or Creative Director.",
                  lifestyle: "Drinker of black coffee, lover of B&W filters.",
                  summary: "The type to obsess over a period in their bio for 30 minutes."
              });
          }
      }
      
      if (userInput) {
          setHasUserCorrection(true);
          setCorrectionStep('idle');
      }

    } finally {
      // Only set loading false if this is the current active request (not aborted)
      if (abortControllerRef.current === controller) {
         setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAnalysis();
    return () => { 
        if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [guest.handle, lang]); 

  const Item = ({ icon: Icon, label, text, delay }: { icon: any, label: string, text: string, delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col gap-2 p-4 bg-white/5 border border-white/5 rounded-sm hover:border-ig-pink/30 transition-colors"
    >
        <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Icon className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-light text-gray-200 leading-relaxed">{text}</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        layoutId={`card-${guest.handle}`}
        className="relative z-50 w-full max-w-4xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
      >
        {/* Left: Visual Identity */}
        <div className="w-full md:w-1/3 min-h-[250px] md:h-auto relative bg-gray-900 flex flex-col items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 shrink-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-ig-pink to-purple-600 mb-6">
                <img 
                    src={imageUrl} 
                    alt={guest.handle}
                    className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
                />
             </div>
             <div className="text-center z-10">
                 <h2 className="text-2xl font-bold text-white tracking-tight">@{guest.handle}</h2>
                 <p className="text-xs text-gray-400 font-mono mt-2 tracking-widest">{guest.followerCount}</p>
                 
                 {/* AI Title Tag */}
                 {data && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="mt-6 px-4 py-2 bg-ig-pink/10 text-ig-pink text-xs font-bold uppercase tracking-widest border border-ig-pink/20 rounded-full"
                    >
                        {data.title}
                    </motion.div>
                 )}

                 {/* User Verified Tag */}
                 {hasUserCorrection && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center justify-center gap-1 text-[10px] text-green-400 uppercase tracking-widest"
                     >
                         <CheckCircle2 className="w-3 h-3" />
                         {t.userVerified}
                     </motion.div>
                 )}
             </div>
        </div>

        {/* Right: AI Analysis & Correction */}
        <div className="w-full md:w-2/3 p-6 md:p-12 flex flex-col relative overflow-y-auto custom-scrollbar">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 mb-8 text-ig-pink shrink-0">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">{t.geminiTitle}</span>
            </div>

            <div className="flex-1 flex flex-col justify-start">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-500">
                         <div className="w-12 h-12 border-2 border-ig-pink border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-xs tracking-widest animate-pulse">{t.analyzingLoader}</p>
                    </div>
                ) : data ? (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Item icon={Brain} label={t.personality} text={data.personality} delay={0.1} />
                            <Item icon={Briefcase} label={t.career} text={data.career} delay={0.2} />
                            <Item icon={Coffee} label={t.lifestyle} text={data.lifestyle} delay={0.3} />
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 p-6 bg-white/5 border-l-2 border-ig-pink"
                        >
                            <Quote className="w-6 h-6 text-white/20 mb-2" />
                            <p className="text-lg font-light text-white italic">
                                "{data.summary}"
                            </p>
                        </motion.div>
                    </div>
                ) : (
                   <div className="text-center text-gray-500 py-10">{t.unavailable}</div>
                )}
            </div>
            
            {/* Footer / Correction Section */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4 shrink-0">
                
                {/* ID Info */}
                <div className="text-xs text-gray-600 font-mono flex justify-between items-center">
                    <span>{t.system}</span>
                    <span>{t.id}: {btoa(guest.handle).substring(0, 8)}</span>
                </div>

                {/* Correction Interactions */}
                <AnimatePresence mode="wait">
                    {/* State 1: Idle (Show Inquiry Button) */}
                    {correctionStep === 'idle' && !loading && (
                        <motion.button 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setCorrectionStep('verify')}
                            className="text-[10px] text-gray-500 hover:text-ig-pink flex items-center gap-2 self-start transition-colors uppercase tracking-widest"
                        >
                            <Edit3 className="w-3 h-3" />
                            {t.inaccurate}
                        </motion.button>
                    )}

                    {/* State 2: Legal Verification */}
                    {correctionStep === 'verify' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-900/20 border border-red-500/30 p-4 rounded-sm"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                <div>
                                    <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-1">{t.identityCheck}</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed">{t.legalWarning}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button 
                                    onClick={() => setCorrectionStep('idle')}
                                    className="text-[10px] font-bold text-gray-500 hover:text-white px-3 py-2 transition-colors"
                                >
                                    {t.cancel}
                                </button>
                                <button 
                                    onClick={() => setCorrectionStep('input')}
                                    className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
                                >
                                    {t.yesOwner}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* State 3: Input Field */}
                    {correctionStep === 'input' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-3"
                        >
                            <div className="relative">
                                <label className="text-[10px] text-ig-pink uppercase tracking-widest mb-1 block">{t.correctionLabel}</label>
                                <textarea
                                    autoFocus
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder={lang === 'zh' ? "我是职业摄影师，平时喜欢极限运动..." : "I'm actually a professional photographer..."}
                                    className="w-full bg-black/50 border-b border-white/20 text-white p-3 text-sm focus:outline-none focus:border-ig-pink transition-colors h-24 resize-none font-mono"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                 <button 
                                    onClick={() => setCorrectionStep('idle')}
                                    className="text-[10px] font-bold text-gray-500 hover:text-white px-3 py-2 transition-colors uppercase"
                                >
                                    {t.cancel}
                                </button>
                                <button 
                                    onClick={() => fetchAnalysis(manualInput)}
                                    disabled={!manualInput.trim()}
                                    className="bg-ig-pink hover:bg-pink-600 text-white text-[10px] font-bold px-4 py-2 rounded-sm transition-colors uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.regenerate}
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
