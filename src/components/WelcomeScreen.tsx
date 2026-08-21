import { useState, FormEvent } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Hero / Visual Pane */}
      <div className="relative w-full lg:w-5/12 xl:w-1/2 bg-sky-950 overflow-hidden flex flex-col justify-between p-8 sm:p-10 lg:p-16">
        <div className="absolute inset-0">
          <img 
            src="/Picture3.png" 
            alt="Exhibition Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950/90 via-sky-900/80 to-sky-950/95" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <img src="/churchlogo.jpg" alt="St. Michael's Catholic Church" className="w-10 h-10 object-contain rounded-full border border-sky-800" />
          <span className="text-amber-50 font-bold tracking-widest uppercase text-xs sm:text-sm">
            St. Michael's Catholic Church
          </span>
        </div>

        <div className="relative z-10 mt-8 sm:mt-12 lg:mt-0 py-8 lg:py-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-white leading-tight mb-4 sm:mb-6 drop-shadow-lg">
            The Exhibition of Eucharistic Miracles
          </h1>
          <p className="text-sky-200 text-base sm:text-lg lg:text-xl font-medium max-w-lg leading-relaxed">
            An extensive catalog of approved miraculous events, meticulously gathered and presented to deepen your faith and understanding.
          </p>
        </div>

        <div className="relative z-10 mt-4 sm:mt-12 lg:mt-0 flex items-center gap-4 border-t border-sky-800/50 pt-6 sm:pt-8">
          <img src="/author_691a09f6a1753_0_1638780.avif" alt="Blessed Jesvin Ruble" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400/50 object-cover shadow-lg" />
          <div>
            <p className="text-sky-300 text-xs sm:text-sm font-medium">Curated for Summer Camp 2026</p>
            <p className="text-white font-serif italic font-bold text-sm sm:text-base">by blessed Jesvin Ruble</p>
          </div>
        </div>
      </div>

      {/* Login / Entry Form Pane */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md relative z-10 py-8 lg:py-0">
          {/* Decorative Icon */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-100 rounded-full blur-xl opacity-60"></div>
              <img src="/Picture1.png" alt="Jesus" className="h-24 sm:h-32 w-auto object-contain relative z-10 drop-shadow-xl" />
            </div>
          </div>

          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950 mb-3 font-serif">
              Welcome, Future Saints!
            </h2>
            <p className="text-sky-600 font-medium text-base sm:text-lg leading-relaxed">
              Please enter your name to begin your journey, track your reading time, and save your favorite miracles.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-center text-lg sm:text-xl font-bold px-6 py-4 sm:py-5 border-2 border-slate-200 rounded-2xl bg-slate-50 text-sky-950 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all shadow-sm group-hover:border-slate-300"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-950 hover:bg-sky-900 text-white font-bold text-base sm:text-lg py-4 sm:py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
              disabled={!name.trim()}
            >
              <BookOpen className="w-5 h-5" />
              Enter the Exhibition
            </button>
          </form>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-slate-400 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              A digitally restored interactive archive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
