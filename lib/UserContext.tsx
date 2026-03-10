'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NadiaUser {
  user_id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  age: number | null;
  gender: string | null;
  marital_status: string | null;
  city_tier: string | null;
  education: string | null;
  occupation: string | null;
  income_band_inr_per_month: string | null;
  key_context: string | null;
  primary_goals: string | null;
  privacy_sensitivity: string | null;
}

interface UserContextType {
  user: NadiaUser | null;
  setUser: (u: NadiaUser | null) => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<NadiaUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nadiaura-user');
      if (stored) setUserState(JSON.parse(stored));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const setUser = (u: NadiaUser | null) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem('nadiaura-user', JSON.stringify(u));
      else    localStorage.removeItem('nadiaura-user');
    } catch { /* ignore */ }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nadiaura-user');
    localStorage.removeItem('nadiaura-pending-user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
