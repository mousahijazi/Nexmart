"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from './AlertProvider';
import { useRouter } from "../lib/i18n/routing";
import { loginUser, registerUser, getCurrentUser, logoutApi } from "../helper/fetchApi";
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export default function UserProvider({children}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const {showAlert} = useAlertContext();

  const fetchUser = async () => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      setUser(null);
      setRole(null);
      setRedirectTo(null);
      setLoading(false);
      return;
    }

    const result = await getCurrentUser(token);

    if (!result.success) {
      localStorage.removeItem("nexmart-token");
      setUser(null);
      setRole(null);
      setRedirectTo(null);
      setLoading(false);
      return;
    }

    setUser(result.user);
    setRole(result.role);
    setRedirectTo(result.redirectTo);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data, isLogin) => {
    if (!isLogin && (!data.firstName.trim() || !data.lastName.trim())) {
      showAlert("Please enter both your First and Last name", "danger");
      return { success: false };
    }

    let result = null;
    if (isLogin) {
      result = await loginUser(data.email, data.password);
    } else {
      result = await registerUser(data.email, data.password, data.firstName, data.lastName);
    }

    if (!result.success) {
      showAlert(result.message, "danger");
      return { success: false };
    }

    if (!result.token) {
      showAlert("Account created! Please log in.", "success");
      setTimeout(() => router.replace("/login"), 1200);
      return { success: true };
    }

    localStorage.setItem("nexmart-token", result.token);

    const loggedInUser = result.user;

    if (!loggedInUser) {
      showAlert("Unable to get user information", "danger");
      return { success: false };
    }

    const userId = loggedInUser._id;

    setUser(loggedInUser);
    setRole(loggedInUser.role);
    setRedirectTo(result.redirectTo);

    // merged cart
    const guestCart = JSON.parse(localStorage.getItem("cart-guest")) || [];
    const userCart = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];
    const mergedCart = [
      ...userCart, 
      ...guestCart.filter(guestItem => !userCart.some(userItem => userItem._id === guestItem._id))
    ];

    localStorage.setItem(`cart-${userId}`, JSON.stringify(mergedCart));
    localStorage.removeItem("cart-guest");

    // merged wishlist
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist-guest")) || [];
    const userWishlist =JSON.parse(localStorage.getItem(`wishlist-${userId}`)) || [];
    const mergedWishlist = [
        ...userWishlist,
        ...guestWishlist.filter(guestItem => !userWishlist.some(userItem => userItem._id === guestItem._id))
    ];

    localStorage.setItem(`wishlist-${userId}`, JSON.stringify(mergedWishlist));
    localStorage.removeItem("wishlist-guest");
    
    const displayName = loggedInUser?.firstName || loggedInUser?.email;
    showAlert(`Welcome Back, ${displayName}!`);

    setTimeout(() => {
      router.replace("/");
    }, 1200);

    return { success: true };
  };

  const updateProfile = async (updatedFields, imageFile, localPreviewUrl) => {
    try {
      setIsUploadingImage(true);
        if (localPreviewUrl) {
        setUser(prev => ({
          ...prev,
          user_metadata: {
            ...prev?.user_metadata,
            ...updatedFields,
            image: localPreviewUrl
          }
        }));
      }

      let imageUrl = updatedFields.image;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: {...user?.user_metadata, ...updatedFields, image: imageUrl}
      });

      if (error) {
        showAlert(error.message, "danger");
        return { success: false, message: error.message };
      }

      setUser(data.user);
      showAlert("Profile updated successfully!", "success");

      setIsUploadingImage(false);
      return { success: true };
    } catch (error) {
      showAlert("Something went wrong", "danger");
      setIsUploadingImage(false);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("nexmart-token");
      
      if (token) {
        await logoutApi(token);
      }
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      localStorage.removeItem("nexmart-token");
      setUser(null);
      setRole(null);
      setRedirectTo(null);
      
      showAlert("You have successfully logged out", "success");
      
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    }
  };

  const handleAccountClick = (path) => {
    const token = localStorage.getItem("nexmart-token");
    if (!token) {
      router.replace(path);
      return;
    }

    if (!redirectTo) {
      console.log("redirectTo is not found !")
      return;
    }

    router.replace(redirectTo);
  };

  const value = {
    user, 
    setUser,
    
    loading,
    setLoading,

    role,
    setRole,
    redirectTo,
    setRedirectTo,
    handleAccountClick,

    isUploadingImage,
    userImage,
    setUserImage,

    login,
    updateProfile,
    logout,

    activeTab,
    setActiveTab,
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
