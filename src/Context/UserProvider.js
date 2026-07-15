"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from './AlertProvider';
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

const UserContext = createContext();

export default function UserProvider({children}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {showAlert} = useAlertContext();

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      const session = result.data.session; 
      session ? setUser(session.user) : setUser(null); 

      setLoading(false);
    });

    const result = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    const listener = result.data;

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    showAlert("You have successfully logged out", "danger");
    setTimeout(() => {
      router.replace("/");
    }, 1200);
  };

  const value = {
      user, 
      setUser,
      logout,
      loading,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext);
}
