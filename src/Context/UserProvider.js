"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from './AlertProvider';
import { useRouter } from "next/navigation";

const UserContext = createContext();

export default function UserProvider({children}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {showAlert} = useAlertContext();

  useEffect(() => {
    const currentId = localStorage.getItem("current-user-id");
    if (!currentId) {
      setLoading(false);
      return;
    }

    const savedUser = localStorage.getItem(`user-${currentId}`);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const logout = () => {
    if (user?.id) {
      localStorage.removeItem(`user-${user.id}`);
    }
    localStorage.removeItem("current-user-id");

    setUser(null);
    showAlert(`You have successfully logged out`, "danger");
    
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
