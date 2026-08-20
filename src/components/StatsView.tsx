import { Clock, Heart, BookOpen, LogOut } from 'lucide-react';
import { UserData } from '../hooks/useUserData';
import { Miracle } from '../types';
import miraclesData from '../data.json';

interface StatsViewProps {
  userData: UserData;
  onSelectMiracle: (miracle: Miracle) => void;
  onLogout: () => void;
}

export function StatsView({ userData, onSelectMiracle, onLogout }: StatsViewProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const favoriteMiracles = (miraclesData as Miracle[]).filter(m => userData.favorites.includes(m.id));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img src="/Picture4.png" className="h-20 w-auto object-contain drop-shadow-md" alt="Avatar" />
            <div>
              <h2 className="text-3xl font-extrabold text-sky-950 leading-tight">{userData.name}'s Profile</h2>
              <p className="text-lg font-medium text-sky-600">Pilgrim Statistics</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col items-center text-center">
            <Clock className="w-12 h-12 text-sky-400 mb-4" />
            <span className="text-4xl font-black text-sky-900">{formatTime(userData.totalTimeSeconds)}</span>
            <span className="text-sm font-bold text-sky-500 uppercase tracking-wider mt-2">Time Spent</span>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 text-sky-400 mb-4" />
            <span className="text-4xl font-black text-sky-900">{userData.viewedMiracles.length}</span>
            <span className="text-sm font-bold text-sky-500 uppercase tracking-wider mt-2">Miracles Viewed</span>
          </div>
        </div>

        {/* Favorites List */}
        <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm">
          <h3 className="text-2xl font-bold text-sky-900 mb-6 flex items-center gap-3">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            Your Favorites ({favoriteMiracles.length})
          </h3>
          
          {favoriteMiracles.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-sky-200">
              <Heart className="w-12 h-12 text-sky-200 mx-auto mb-3" />
              <p className="text-sky-600 font-medium text-lg">You haven't favorited any miracles yet.</p>
              <p className="text-sky-400 mt-2">Click the heart icon on a miracle to save it here.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteMiracles.map(miracle => (
                <li key={miracle.id}>
                  <button
                    onClick={() => {
                      onSelectMiracle(miracle);
                    }}
                    className="w-full text-left bg-slate-50 p-5 rounded-2xl border border-sky-100 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-lg text-sky-900 line-clamp-1">{miracle.title}</p>
                      <p className="text-sm font-medium text-sky-500 mt-1">{miracle.year || 'Unknown Year'} &bull; {miracle.category}</p>
                    </div>
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform flex-shrink-0 ml-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
