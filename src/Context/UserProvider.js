"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from './AlertProvider';
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/helper/fetchApi";
import { supabase } from '@/lib/supabase';

const UserContext = createContext();

export default function UserProvider({children}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userImage, setUserImage] = useState("");
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

  const login = async (email, password, isLogin) => {
    if (!isLogin && (!firstName.trim() || !lastName.trim())) {
      showAlert("Please enter both your First and Last name", "danger");
      return { success: false };
    }

    let result = null;
    if (isLogin) {
      result = await loginUser(email, password);
    } else {
      result = await registerUser(email, password, firstName, lastName, userImage);
    }

    if (!result.success) {
      showAlert(result.message, "danger");
      return { success: false };
    }

    const loggedInUser = result.user;

    // merged cart
    const guestCart = JSON.parse(localStorage.getItem("cart-guest")) || [];
    const userCart = JSON.parse(localStorage.getItem(`cart-${loggedInUser.id}`)) || [];
    const mergedCart = [
      ...userCart, 
      ...guestCart.filter(guestItem => !userCart.some(userItem => userItem.id === guestItem.id))
    ];

    localStorage.setItem(`cart-${loggedInUser.id}`, JSON.stringify(mergedCart));
    localStorage.removeItem("cart-guest");

    // merged wishlist
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist-guest")) || [];
    const userWishlist =JSON.parse(localStorage.getItem(`wishlist-${loggedInUser.id}`)) || [];
    const mergedWishlist = [
        ...userWishlist,
        ...guestWishlist.filter(guestItem => !userWishlist.some(userItem => userItem.id === guestItem.id))
    ];

    localStorage.setItem(`wishlist-${loggedInUser.id}`, JSON.stringify(mergedWishlist));
    localStorage.removeItem("wishlist-guest");

    setUser(loggedInUser);
    
    const displayName = loggedInUser?.user_metadata?.first_name || loggedInUser.email;
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
    await supabase.auth.signOut();
    showAlert("You have successfully logged out", "danger");
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };

  const value = {
      user, 
      setUser,
      logout,
      loading,
      isUploadingImage,
      firstName,
      setFirstName,
      lastName,
      setLastName,
      userImage,
      setUserImage,
      login,
      updateProfile,
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
