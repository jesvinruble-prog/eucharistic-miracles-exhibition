import { useState, useEffect } from 'react';

export interface UserData {
  name: string | null;
  favorites: string[];
  viewedMiracles: string[];
  totalTimeSeconds: number;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const stored = localStorage.getItem('eucharistic_user_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse user data', e);
    }
    return { name: null, favorites: [], viewedMiracles: [], totalTimeSeconds: 0 };
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('eucharistic_user_data', JSON.stringify(userData));
  }, [userData]);

  // Ensure stats are saved before leaving/closing tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem('eucharistic_user_data', JSON.stringify(userData));
      }
    };
    const handleBeforeUnload = () => {
      localStorage.setItem('eucharistic_user_data', JSON.stringify(userData));
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userData]);

  // Timer for time spent
  useEffect(() => {
    if (!userData.name) return; // don't track if not signed in
    const interval = setInterval(() => {
      if (!document.hidden) {
        setUserData(prev => ({
          ...prev,
          totalTimeSeconds: prev.totalTimeSeconds + 1
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userData.name]);

  const setName = (name: string) => {
    setUserData(prev => ({ ...prev, name }));
  };

  const toggleFavorite = (id: string) => {
    setUserData(prev => {
      const isFav = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id]
      };
    });
  };

  const markViewed = (id: string) => {
    setUserData(prev => {
      if (prev.viewedMiracles.includes(id)) return prev;
      return { ...prev, viewedMiracles: [...prev.viewedMiracles, id] };
    });
  };

  const logout = () => {
    setUserData({ name: null, favorites: [], viewedMiracles: [], totalTimeSeconds: 0 });
    localStorage.removeItem('eucharistic_user_data');
  };

  return { userData, setName, toggleFavorite, markViewed, logout };
}
