
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, User, Loader2, ArrowRight, ScrollText, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Guest, GuestCard } from './components/GuestCard';
import { GeminiModal } from './components/GeminiModal';
import { GameRulesModal } from './components/GameRulesModal';
import { API_ENDPOINTS, TRANSLATIONS, Language, LANGUAGES } from './constants';

// --- Types ---
interface ScrapeResponse {
  success: boolean;
  data?: Guest;
  message?: string;
}

// --- Constants & Mock Data (for demo purposes if API is unreachable) ---
const MOCK_GUESTS: Guest[] = [
  {
    handle: 'designtheory',
    avatarUrl: 'https://picsum.photos/id/1/200/200',
    bio: 'Visual explorer. Minimalist at heart. Creating digital landscapes for the future.',
    followerCount: '12.5k',
  },
  {
    handle: 'architect_daily',
    avatarUrl: 'https://picsum.photos/id/2/200/200',
    bio: 'Concrete, Glass, Light. Archiving the best of brutalism.',
    followerCount: '450k',
  },
  {
    handle: 'coffee_culture',
    avatarUrl: 'https://picsum.photos/id/3/200/200',
    bio: 'Pour over enthusiast. Seeking the perfect bean.',
    followerCount: '28k',
  },
  {
    handle: 'neon.nights',
    avatarUrl: 'https://picsum.photos/id/4/200/200',
    bio: 'Cyberpunk aesthetics and night photography from Tokyo.',
    followerCount: '89.2k',
  },
  // Add more to demonstrate pagination (Total ~50 guests)
  ...Array.from({ length: 46 }).map((_, i) => ({
    handle: `guest_user_${i + 5}`,
    avatarUrl: `https://picsum.photos/id/${(i % 50) + 10}/200/200`,
    bio: 'Just another creative soul wandering through the digital void. Seeking connection in the noise.',
    followerCount: `${Math.floor(Math.random() * 500)}k`,
  })),
];

export default function App() {
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [page, setPage] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [lang, setLang] = useState<Language>('zh');
  
  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  
  // Auto-pagination logic
  const AUTO_PLAY_INTERVAL = 15000;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const itemsPerPage = 12; 
  const totalPages = Math.ceil(guests.length / itemsPerPage);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Pause auto-play if interaction is happening OR if in admin mode
    if (totalPages > 1 && !selectedGuest && !isSearchOpen && !isRulesOpen && !isAdminMode && !isAdminModalOpen && !showExitConfirmation) {
      timerRef.current = setInterval(() => {
        setPage((prev) => (prev + 1) % totalPages);
      }, AUTO_PLAY_INTERVAL);
    }
  }, [totalPages, selectedGuest, isSearchOpen, isRulesOpen, isAdminMode, isAdminModalOpen, showExitConfirmation]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Handle user manual interaction
  const handleInteraction = () => {
    resetTimer();
  };

  const handlePageClick = (pageIndex: number) => {
    setPage(pageIndex);
    handleInteraction();
  };

  // --- Search / Add Guest Logic ---
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    handleInteraction(); // Reset timer

    try {
      // In a real Next.js app, this points to /api/lookup
      const response = await fetch(`${API_ENDPOINTS.LOOKUP}?tag=${searchQuery}`);
      
      let data: ScrapeResponse;
      
      if (response.ok) {
        data = await response.json();
      } else {
         // Fallback for demo environment
         console.warn("API unavailable in demo, mocking success");
         await new Promise(resolve => setTimeout(resolve, 1500)); 
         data = {
           success: true,
           data: {
             handle: searchQuery,
             avatarUrl: `https://picsum.photos/seed/${searchQuery}/200/200`,
             bio: "Freshly scraped from the digital ether. This is a simulated response for the demo environment.",
             followerCount: "N/A"
           }
         };
      }

      if (data.success && data.data) {
        setGuests(prev => [data.data!, ...prev]);
        setPage(0); // Jump to first page to see new user
        setIsSearchOpen(false);
        setSearchQuery('');
      } else {
        alert('Could not find user or profile is empty.');
      }
    } catch (error) {
      console.error("Search failed", error);
      // Mock success for UX demo
       setGuests(prev => [{
         handle: searchQuery,
         avatarUrl: `https://picsum.photos/seed/${searchQuery}/200/200`,
         bio: "This is a mock bio because the backend scraping service is not running in this browser environment.",
         followerCount: "1.2m"
       }, ...prev]);
       setPage(0);
       setIsSearchOpen(false);
       setSearchQuery('');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Admin Logic ---
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword === '1234567') {
          setIsAdminMode(true);
          setIsAdminModalOpen(false);
          setAdminPassword('');
      } else {
          alert(t.wrongPassword);
      }
  };

  const handleDeleteGuest = (indexToDelete: number) => {
      const globalIndex = page * itemsPerPage + indexToDelete;
      // Confirmation could be added here, but prompt implied simple delete in admin mode.
      // Let's remove from the main list.
      const newGuests = [...guests];
      newGuests.splice(globalIndex, 1);
      setGuests(newGuests);
      
      // Adjust page if empty
      const newTotalPages = Math.ceil(newGuests.length / itemsPerPage);
      if (page >= newTotalPages && page > 0) {
          setPage(newTotalPages - 1);
      }
  };

  const handleAdminButtonClick = () => {
      handleInteraction();
      if (isAdminMode) {
          setShowExitConfirmation(true);
      } else {
          setIsAdminModalOpen(true);
      }
  };

  const confirmExitAdmin = () => {
      setIsAdminMode(false);
      setShowExitConfirmation(false);
      handleInteraction();
  };

  const paginatedGuests = guests.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Dynamic Grid Layout Logic
  const getGridClass = (count: number) => {
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-3 grid-rows-2";
    if (count <= 8) return "grid-cols-4 grid-rows-2";
    return "grid-cols-4 grid-rows-3";
  };

  const t = TRANSLATIONS[lang];

  return (
    <main className="relative w-screen h-screen bg-deep-black text-off-white overflow-hidden font-sans selection:bg-ig-pink selection:text-white">
      
      {/* --- Header / Nav --- */}
      <header className="absolute top-0 left-0 w-full p-8 z-30 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-3xl font-bold tracking-tighter uppercase">{t.appTitle}</h1>
          {isAdminMode ? (
              <div className="mt-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest inline-block rounded-sm animate-pulse">
                  {t.adminMode} (ACTIVE)
              </div>
          ) : (
             <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">
                {t.subtitlePrefix}
                <a 
                href="https://stanse-837715360412.us-central1.run.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-ig-pink transition-colors border-b border-transparent hover:border-ig-pink pb-0.5"
                >
                Stanse
                </a>
                {t.subtitleSuffix}
            </p>
          )}
        </div>
        
        <div className="pointer-events-auto flex flex-col items-end gap-3">
            {/* Top Row: Pagination & Languages */}
            <div className="flex items-center gap-6">
                {/* Pagination (Moved here) */}
                {totalPages > 1 && (
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePageClick(idx)}
                            className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono border transition-all duration-300 ${
                            page === idx 
                                ? 'bg-ig-pink border-ig-pink text-white' 
                                : 'bg-transparent border-white/20 text-gray-500 hover:border-white/50 hover:text-white'
                            }`}
                        >
                            {idx + 1}
                        </button>
                        ))}
                    </div>
                )}
                
                {/* Language Switcher */}
                <div className="flex gap-3">
                    {Object.keys(LANGUAGES).map((key) => (
                        <button 
                        key={key}
                        onClick={() => { setLang(key as Language); handleInteraction(); }}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${lang === key ? 'text-ig-pink scale-110' : 'text-gray-600 hover:text-white'}`}
                        >
                        {key}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2"> {/* Reduced gap for tight layout */}
                
                {/* Admin Button */}
                <button 
                    onClick={handleAdminButtonClick}
                    className={`group flex items-center transition-colors duration-300 ${isAdminMode ? 'text-red-500 hover:text-red-400' : 'hover:text-white text-gray-500'}`}
                >
                    <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out text-xs tracking-widest uppercase mr-0 group-hover:mr-3 text-right">
                        {isAdminMode ? t.exitAdmin : t.adminMode}
                    </span>
                    <div className={`w-10 h-10 border rounded-full flex items-center justify-center backdrop-blur-sm transition-all shrink-0 ${isAdminMode ? 'border-red-500/50 bg-red-900/20' : 'border-white/10 bg-white/5 group-hover:border-white/30 group-hover:bg-white/10'}`}>
                        {isAdminMode ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                </button>

                {/* Game Rules Button */}
                <button 
                    onClick={() => { setIsRulesOpen(true); handleInteraction(); }}
                    className="group flex items-center hover:text-white transition-colors duration-300"
                >
                    {/* Text slides out on hover */}
                    <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out text-xs tracking-widest uppercase text-gray-400 group-hover:text-white mr-0 group-hover:mr-3 text-right">
                        {t.gameRules}
                    </span>
                    <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:border-white/30 group-hover:bg-white/10 transition-all shrink-0">
                        <ScrollText className="w-4 h-4 text-gray-300 group-hover:text-white" />
                    </div>
                </button>

                {/* Add Guest Button */}
                <button 
                    onClick={() => { setIsSearchOpen(true); handleInteraction(); }}
                    className="group flex items-center hover:text-ig-pink transition-colors duration-300"
                >
                    {/* Text slides out on hover, pushing Game Rules button left */}
                    <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out text-xs tracking-widest uppercase mr-0 group-hover:mr-3 text-right">
                        {t.addGuest}
                    </span>
                    <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:border-ig-pink/50 group-hover:bg-ig-pink/10 transition-all shrink-0">
                        <Search className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </div>
      </header>

      {/* --- Main Grid --- */}
      <div className={`w-full h-full flex items-center justify-center px-8 pt-28 pb-8 transition-colors duration-500 ${isAdminMode ? 'bg-red-900/5' : ''}`}>
        <AnimatePresence mode="wait">
            <motion.div 
                key={page}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`grid gap-4 w-full h-full max-w-[1800px] max-h-[1000px] ${getGridClass(paginatedGuests.length)}`}
            >
                {paginatedGuests.map((guest, idx) => (
                    <GuestCard 
                        key={`${guest.handle}-${idx}`} 
                        guest={guest} 
                        onClick={() => { setSelectedGuest(guest); handleInteraction(); }}
                        index={idx}
                        isAdmin={isAdminMode}
                        onDelete={() => handleDeleteGuest(idx)}
                    />
                ))}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Search Overlay --- */}
      <AnimatePresence>
        {isSearchOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center"
            >
                <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl px-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-ig-pink font-bold tracking-widest uppercase ml-1">{t.igIdentity}</label>
                        <div className="relative group">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.enterHandle}
                                className="w-full bg-transparent border-b-2 border-white/20 py-4 text-5xl font-extralight focus:outline-none focus:border-ig-pink transition-colors placeholder:text-white/10"
                                autoFocus
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-500 mr-4">{t.pressEnter}</span>
                                {isLoading && <Loader2 className="inline w-5 h-5 animate-spin text-ig-pink" />}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-light">
                        {t.analyzing}
                    </p>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

       {/* --- Admin Login Modal --- */}
       <AnimatePresence>
        {isAdminModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
            >
                <button 
                    onClick={() => setIsAdminModalOpen(false)}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                <form onSubmit={handleAdminLoginSubmit} className="w-full max-w-xl px-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-red-500 font-bold tracking-widest uppercase ml-1 flex items-center gap-2">
                             <Lock className="w-3 h-3" />
                             {t.adminMode}
                        </label>
                        <div className="relative group">
                            <input 
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                placeholder={t.passwordPlaceholder}
                                className="w-full bg-transparent border-b-2 border-white/20 py-4 text-5xl font-extralight focus:outline-none focus:border-red-500 transition-colors placeholder:text-white/10 text-white"
                                autoFocus
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-500 mr-4">{t.pressEnter}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-light">
                        {t.enterPassword}
                    </p>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- Exit Admin Confirmation Modal --- */}
      <AnimatePresence>
          {showExitConfirmation && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                  <motion.div 
                     initial={{ scale: 0.9, y: 10 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-[#111] border border-white/10 p-8 rounded-sm max-w-sm w-full shadow-2xl"
                  >
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center text-red-500">
                              <AlertTriangle className="w-5 h-5" />
                          </div>
                          <h3 className="text-white font-bold uppercase tracking-wide">{t.exitAdmin}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                          {t.confirmExit}
                      </p>
                      <div className="flex gap-3 justify-end">
                          <button 
                              onClick={() => setShowExitConfirmation(false)}
                              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                          >
                              {t.cancel}
                          </button>
                          <button 
                              onClick={confirmExitAdmin}
                              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                          >
                              {t.confirm}
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* --- Game Rules Modal --- */}
      <AnimatePresence>
        {isRulesOpen && (
            <GameRulesModal 
                onClose={() => setIsRulesOpen(false)}
                lang={lang}
            />
        )}
      </AnimatePresence>

      {/* --- Gemini Modal --- */}
      <AnimatePresence>
        {selectedGuest && (
            <GeminiModal 
                guest={selectedGuest} 
                onClose={() => setSelectedGuest(null)}
                lang={lang}
            />
        )}
      </AnimatePresence>
      
      {/* --- Progress Bar for Auto-Play --- */}
      {totalPages > 1 && !selectedGuest && !isSearchOpen && !isRulesOpen && !isAdminMode && !isAdminModalOpen && !showExitConfirmation && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                  key={page}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                  className="h-full bg-ig-pink"
              />
          </div>
      )}

    </main>
  );
}
