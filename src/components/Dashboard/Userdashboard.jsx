"use client";
import Image from "next/image";
import { LogoutButton } from "@/index";
import { useUserContext } from "@/Context/UserProvider";
import { useProductContext } from "@/Context/CartProvider";

export default function Userdashboard() {
  const { user } = useUserContext();
  const { cart } = useProductContext();

  const data = [
    {
      title: "Email",
      value: user?.email || "N/A",
    },
    {
      title: "Username",
      value: user?.username || "N/A",
    },
    {
      title: "Phone",
      value: user?.phone || "N/A",
    },
    {
      title: "Products In Cart",
      value: cart.length,
    },
  ];

  return (
    <div className="bg-white shadow-lg py-12 px-6 rounded-2xl">
      <div className="flex flex-col justify-center items-start gap-8">
        <div className="w-full">
          <span className="text-xs font-bold tracking-widest text-[#5B3A21]/80 uppercase">
            Profile
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5B3A21]">
            Welcome Back
          </h1>
          <div className="flex max-[480px]:flex-col items-start min-[480px]:items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3">
              <Image
                src={user?.image || `/Profile.jpg`}
                alt={user?.firstName || "Guest"}
                width={60}
                height={60}
                className="rounded-full bg-gray-400"
              />
              <p className="mt-2 text-gray-500">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Guest"}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 w-full">
          {data.map((ele, index) => (
            <div key={index} className="bg-[#f7f7f7] rounded-xl p-5 flex max-md:flex-col md:items-center gap-2">
              <p className="text-sm sm:text-[16px] text-gray-500"> {ele.title} </p>
              <h3 className="font-semibold text-[#5B3A21] break-all"> {ele.value} </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}