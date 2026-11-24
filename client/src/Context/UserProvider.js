"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAlertContext } from "./AlertProvider";
import { useRouter } from "../lib/i18n/routing";
import { loginUser, registerUser, logoutApi, getCurrentUser, updateUser } from "@/helper/fetchApi";

const UserContext = createContext(null);

function readLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function mergeGuestData(userId) {
  if (!userId) return;

  const guestCart = readLocalArray("cart-guest");
  const userCart = readLocalArray(`cart-${userId}`);

  const mergedCart = [
    ...userCart,
    ...guestCart.filter(
      (guestItem) => !userCart.some((userItem) => userItem._id === guestItem._id)
    ),
  ];

  localStorage.setItem(`cart-${userId}`, JSON.stringify(mergedCart));
  localStorage.removeItem("cart-guest");

  const guestWishlist = readLocalArray("wishlist-guest");
  const userWishlist = readLocalArray(`wishlist-${userId}`);

  const mergedWishlist = [
    ...userWishlist,
    ...guestWishlist.filter(
      (guestItem) => !userWishlist.some((userItem) => userItem._id === guestItem._id)
    ),
  ];

  localStorage.setItem(`wishlist-${userId}`, JSON.stringify(mergedWishlist));
  localStorage.removeItem("wishlist-guest");
}

export default function UserProvider({ children, initialUser = null }) {
  const router = useRouter();
  const { showAlert } = useAlertContext();

  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(initialUser?.role || null);

  const [redirectTo, setRedirectTo] = useState(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const applyUser = useCallback((userData, destination = null) => {
    setUser(userData || null);
    setRole(userData?.role || null);
    setRedirectTo(destination || null);
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setRole(null);
    setRedirectTo(null);
  }, []);

  useEffect(() => {
    localStorage.removeItem("nexmart-token");
    localStorage.removeItem("nexmart-user");
  }, []);

  const login = async (data, isLogin) => {
    try {
      if (!isLogin && (!data.firstName?.trim() || !data.lastName?.trim())) {
        showAlert("Please enter both your First and Last name", "danger");

        return { success: false };
      }

      const result = isLogin
        ? await loginUser(data.email, data.password)
        : await registerUser(data.email, data.password, data.firstName, data.lastName, data.phoneNumber);

      if (!result.success) {
        showAlert(result.message, "danger");

        return {
          success: false,
          message: result.message,
        };
      }

      const currentUser = await getCurrentUser();

      if (!currentUser.success || !currentUser.user) {
        if (!isLogin) {
          showAlert("Account created! Please log in.", "success");

          setTimeout(() => {
            router.replace("/auth?mode=login");
          }, 1000);

          return {
            success: true,
            requiresLogin: true,
          };
        }

        showAlert("Login succeeded, but user information could not be loaded.", "danger");

        return {
          success: false,
          message: currentUser.message,
        };
      }

      const loggedInUser = currentUser.user;

      applyUser( loggedInUser, currentUser.redirectTo);

      mergeGuestData(loggedInUser._id);

      const displayName = loggedInUser.firstName || loggedInUser.email;

      showAlert(`Welcome Back, ${displayName}!`, "success");

      setTimeout(() => {
        router.replace(currentUser.redirectTo || "/");
      }, 1000);

      return { success: true };
    } catch (error) {
      console.error("Authentication error:", error);

      const message = error.message || "Something went wrong";

      showAlert(message, "danger");

      return {
        success: false,
        message,
      };
    }
  };

  const updateProfile = async (updatedFields, imageFile) => {
    try {
      if (!user) {
        showAlert("You are not authenticated", "danger" );

        return {
          success: false,
          message: "You are not authenticated",
        };
      }

      setIsUploadingImage(true);

      const formData = new FormData();

      formData.append("firstName", updatedFields.firstName || "");
      formData.append("lastName", updatedFields.lastName || "");
      formData.append("phoneNumber", updatedFields.phoneNumber || "");

      if (imageFile) {
        formData.append("avatar", imageFile);
      }

      const result = await updateUser(formData);

      if (!result.success) {
        showAlert(result.message, "danger");

        return {
          success: false,
          message: result.message,
        };
      }

      applyUser(result.user, redirectTo);

      showAlert("Profile updated successfully!", "success");

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      console.error("updateProfile:", error);

      const message = error.message || "Something went wrong";

      showAlert(message, "danger");

      return {
        success: false,
        message,
      };
    } finally {
      setIsUploadingImage(false);
    }
  };

  const logout = async () => {
    try {
      const result = await logoutApi();

      clearUser();

      localStorage.removeItem("nexmart-token");
      localStorage.removeItem("nexmart-user");

      if (!result.success) {
        showAlert(result.message || "Server logout failed", "danger");
      } else {
        showAlert("You have successfully logged out", "success");
      }
    } catch (error) {
      console.error("Logout error:", error);

      clearUser();

      localStorage.removeItem("nexmart-token");
      localStorage.removeItem("nexmart-user");

      showAlert(error.message || "Server logout failed", "danger");
    } finally {
      router.replace("/");
    }
  };

  const handleAccountClick = (path) => {
    if (!user) {
      router.replace(path || "/auth?mode=login");
      return;
    }

    if (redirectTo) {
      router.replace(redirectTo);
      return;
    }

    router.replace(user.role === "ADMIN" ? "/admin" : "/user");
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
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}