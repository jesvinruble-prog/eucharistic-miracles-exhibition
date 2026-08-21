/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Heart, Menu, X, Code, BookOpen, Info, Church, BarChart2 } from 'lucide-react';
import { MiracleDetail } from './components/MiracleDetail';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StatsView } from './components/StatsView';
import { useUserData } from './hooks/useUserData';
import miraclesData from './data.json';
import { Miracle } from './types';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedMiracle, setSelectedMiracle] = useState<Miracle | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'miracles' | 'about' | 'stats'>('miracles');
  
  const { userData, setName, toggleFavorite, markViewed, logout } = useUserData();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredMiracles = useMemo(() => {
    return (miraclesData as Miracle[]).filter(m => {
      const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.year && m.year.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // Handle escape key to close search blur
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!userData.name) {
    return <WelcomeScreen onComplete={setName} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* Top Navigation Bar */}
      <header className="flex-none bg-white border-b border-sky-100 py-3 lg:py-0 lg:h-20 px-4 sm:px-6 z-40 shadow-sm relative">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between h-full gap-y-3">
          <div className="flex items-center gap-2 sm:gap-4 order-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-sky-900 hover:bg-sky-50 rounded-xl transition-colors"
              title="Toggle Sidebar"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex items-center gap-4">
              <img src="/Picture1.png" alt="Jesus" className="h-10 sm:h-14 w-auto object-contain drop-shadow-sm" />
              <span className="hidden sm:block font-extrabold text-xl sm:text-2xl text-sky-950 tracking-tight">
                Eucharistic Miracles
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:w-auto lg:flex-1 max-w-xl mx-0 lg:mx-4 relative group z-50 order-3 lg:order-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-400 group-focus-within:text-sky-600 transition-colors">
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by country, year, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="block w-full pl-12 pr-4 py-2.5 sm:py-3 border-2 border-sky-100 rounded-full leading-5 bg-sky-50 placeholder-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 text-sm sm:text-lg font-medium text-sky-900 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 order-2 lg:order-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-sky-900">{userData.name}</span>
              <span className="text-xs font-medium text-sky-500">View your stats & favorites</span>
            </div>
            <button onClick={() => setActiveTab('stats')} className="relative group">
              <img src="/Picture4.png" className="h-10 sm:h-14 w-auto object-contain cursor-pointer drop-shadow-md group-hover:scale-105 transition-transform" alt="Avatar" />
              {userData.favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {userData.favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Blur Overlay when Search is Focused */}
        {isSearchFocused && (
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md z-30 transition-all"
            onClick={() => {
              setIsSearchFocused(false);
              searchInputRef.current?.blur();
            }}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-30 transition-all" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar (Master List) */}
        <aside 
          className={`bg-white border-r border-sky-100 flex flex-col transition-all duration-300 z-40 shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)] absolute lg:relative h-full top-0 ${
            isSidebarOpen ? 'translate-x-0 w-[85%] sm:w-80 lg:w-96' : '-translate-x-full lg:translate-x-0 w-[85%] sm:w-80 lg:w-0 overflow-hidden border-none'
          }`}
        >
          <div className="p-4 border-b border-sky-50 bg-sky-50/50 flex items-center justify-between">
            <h3 className="font-bold text-sky-900 flex items-center gap-3 text-lg">
              <img src="/Picture2.png" className="h-10 w-auto object-contain drop-shadow-sm" alt="Icon" />
              Exhibition Catalog
              <span className="ml-auto bg-sky-200 text-sky-800 text-xs py-0.5 px-2 rounded-full">
                {filteredMiracles.length}
              </span>
            </h3>
            {/* Close button for mobile inside sidebar */}
            <button 
              className="lg:hidden p-2 text-sky-500 hover:text-sky-900 hover:bg-sky-100 rounded-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredMiracles.length === 0 ? (
              <div className="p-8 text-center text-sky-600">
                <Heart className="w-12 h-12 text-sky-300 mx-auto mb-3 animate-pulse" />
                <p className="font-medium">No miracles found for "{searchTerm}"</p>
              </div>
            ) : (
              <ul className="divide-y divide-sky-50">
                {filteredMiracles.map((miracle, idx) => {
                  const isSelected = selectedMiracle?.id === miracle.id;
                  return (
                    <li key={`${miracle.id}-${idx}`}>
                      <button
                        onClick={() => {
                          setSelectedMiracle(miracle);
                          markViewed(miracle.id);
                          setActiveTab('miracles');
                          setIsSearchFocused(false);
                          if (window.innerWidth < 1024) setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left p-4 hover:bg-sky-50 transition-colors flex items-center gap-4 ${
                          isSelected ? 'bg-sky-100/60 border-l-4 border-sky-500' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="w-auto px-3 h-14 min-w-[4.5rem] bg-white rounded-2xl shadow-sm border border-sky-100 flex-shrink-0 flex flex-col items-center justify-center text-sky-700 relative">
                          {userData.favorites.includes(miracle.id) && (
                            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 absolute -top-1 -right-1 drop-shadow-sm" />
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-none mb-1">Year</span>
                          <span className="font-black text-sm leading-none text-center whitespace-nowrap">{miracle.year || 'N/A'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sky-950 font-bold truncate text-base leading-tight mb-1">
                            {miracle.title}
                          </p>
                          <p className="text-sky-600 text-sm font-medium truncate">
                            {miracle.category}
                          </p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Content (Detail View) */}
        <main className="flex-1 relative bg-slate-50 overflow-hidden flex flex-col z-0">
          
          {/* Tab Navigation */}
          <div className="flex-none bg-white border-b border-sky-100 px-4 py-3 flex gap-2 shadow-sm z-10">
            <button 
              onClick={() => setActiveTab('miracles')}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'miracles' 
                  ? 'bg-sky-100 text-sky-900 shadow-sm border border-sky-200' 
                  : 'bg-white text-sky-600 hover:bg-sky-50 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Miracles
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'about' 
                  ? 'bg-sky-100 text-sky-900 shadow-sm border border-sky-200' 
                  : 'bg-white text-sky-600 hover:bg-sky-50 border border-transparent'
              }`}
            >
              <Info className="w-4 h-4" />
              About Us
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'stats' 
                  ? 'bg-sky-100 text-sky-900 shadow-sm border border-sky-200' 
                  : 'bg-white text-sky-600 hover:bg-sky-50 border border-transparent'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Stats
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
            {activeTab === 'miracles' ? (
              <MiracleDetail 
                miracle={selectedMiracle} 
                isFavorite={selectedMiracle ? userData.favorites.includes(selectedMiracle.id) : false}
                onToggleFavorite={toggleFavorite}
              />
            ) : activeTab === 'stats' ? (
              <StatsView 
                userData={userData}
                onSelectMiracle={(miracle) => {
                  setSelectedMiracle(miracle);
                  markViewed(miracle.id);
                  setActiveTab('miracles');
                }}
                onLogout={() => {
                  logout();
                  setActiveTab('miracles');
                }}
              />
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start sm:justify-center bg-slate-50 text-slate-800">
                <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-sky-100 p-6 sm:p-10 text-center relative overflow-hidden my-auto">
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-sky-100/80 to-transparent"></div>
                  
                  <img src="/churchlogo.jpg" alt="St. Michael's Catholic Church" className="h-20 sm:h-24 w-auto object-contain mx-auto mb-6 relative z-10 drop-shadow-sm rounded-xl" />
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950 mb-6 sm:mb-8 relative z-10 font-serif">About the Exhibition</h2>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10 text-left bg-sky-50 p-4 sm:p-6 rounded-2xl border border-sky-100 shadow-inner">
                    <img src="/author_691a09f6a1753_0_1638780.avif" alt="Jesvin Ruble" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shadow-md border-4 border-white flex-shrink-0" />
                    <div>
                      <p className="text-base sm:text-lg text-sky-900 font-medium leading-relaxed">
                        This application was created by <strong className="font-extrabold text-sky-950">Jesvin Ruble</strong>, 
                        a 9th-grade student (14 years old as of 2026).
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-base sm:text-lg text-sky-800 font-medium leading-relaxed mb-8 sm:mb-10 relative z-10">
                    It was developed as part of a special project for 
                    <strong className="font-extrabold text-sky-950"> St. Michael's Catholic Church</strong> during the Summer Camp of 2026.
                  </p>

                  <div className="pt-6 sm:pt-8 border-t border-sky-100 relative z-10">
                    <p className="font-bold text-sky-900 font-serif italic text-lg sm:text-xl">
                      — by blessed Jesvin Ruble
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
