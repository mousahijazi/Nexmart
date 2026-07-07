"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from './AlertProvider';

const UserContext = createContext();

export default function UserProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {showAlert} = useAlertContext();

  useEffect(() => {
    if (user?.accessToken) {
        localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    savedUser && (setUser(JSON.parse(savedUser)));

    setLoading(false);
  }, []);

  const logout = () => {
    console.log("log out")
    localStorage.removeItem("user");
    setUser(null);
    showAlert(`You have successfully logged out`, "danger");
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
