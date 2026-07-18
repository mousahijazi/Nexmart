"use client";
import { useState } from "react";
import { LogoutButton, UserImage, UpdateUser } from "@/index";
import { Edit3 } from "lucide-react";
import { useUserContext } from "@/Context/UserProvider";
import { useProductContext } from "@/Context/CartProvider";

export default function Userdashboard() {
  const { user, loading } = useUserContext();
  const { cart } = useProductContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (loading) {
    return (
      <div className="bg-white shadow-lg py-12 px-6 rounded-2xl animate-pulse">
        <div className="flex flex-col gap-8">

          <div className="w-full">
            <div className="h-3 w-20 bg-gray-200 rounded mb-3"></div>

            <h1 className="h-10 max-w-[260px] w-full bg-gray-200 rounded"></h1>

            <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-[60px] h-[60px] rounded-full bg-gray-200 shrink-0"></div>

                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>

              <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 w-full">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  bg-[#f7f7f7]
                  rounded-xl
                  p-5
                  flex
                  max-md:flex-col
                  md:items-center
                  gap-2
                "
              >
                <div className="h-6 w-24 bg-gray-200 rounded"></div>

                <div className="h-6 flex-1 min-w-[120px] bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  const username = user?.user_metadata?.first_name ? `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name || ""}` : "Guest"
  const data = [
    {
      title: "Email",
      value: user?.email || "N/A",
    },
    {
      title: "Username",
      value: username || "N/A",
    },
    {
      title: "Phone",
      value: user?.user_metadata?.phone || "N/A",
    },
    {
      title: "Products In Cart",
      value: cart.length,
    },
  ];

  return (
    <div className="min-[500px]:bg-white min-[500px]:dark:bg-zinc-950 min-[500px]:shadow-lg dark:shadow-black/90 py-12 px-6 rounded-2xl">
      {!user 
        ? <div className="flex items-center justify-center text-[#5B3A21] font-semibold text-lg py-12 px-6 h-[320px]">
            Please log in to view this page.
          </div>
        : <div className="flex flex-col justify-center items-start gap-8">
            <div className="w-full">
              <span className="text-xs font-bold tracking-widest text-[#5B3A21]/80 dark:text-[#A68A64]/80 uppercase">
                Profile
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">
                Welcome Back
              </h1>
              <div className="flex max-md:flex-col items-start md:items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-3">
                  <UserImage />
                  <p className="mt-2 text-gray-500 dark:text-[#e5ded8]">
                    {username}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#5B3A21] dark:bg-[#A68A64] text-white dark:text-[#e5ded8] rounded-full font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                  <LogoutButton />
                  <UpdateUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
              {data.map((ele, index) => (
                <div key={index} className="bg-[#f7f7f7] dark:bg-[#e5ded8] rounded-xl p-5 flex max-md:flex-col md:items-center gap-2">
                  <p className="text-sm sm:text-[16px] text-gray-500"> {ele.title} </p>
                  <h1 className="font-semibold text-[#5B3A21] overflow-hidden"> {ele.value} </h1>
                </div>
              ))}
            </div>
          </div>
      }
    </div>
    
  );
}