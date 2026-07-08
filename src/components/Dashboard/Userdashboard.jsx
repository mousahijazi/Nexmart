"use client";
import Image from "next/image";
import { useUserContext } from "@/Context/UserProvider";
import { useProductContext } from "@/Context/CartProvider";

export default function Userdashboard() {
  const { user, logout } = useUserContext();
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
    <div className="bg-white shadow-lg py-12 px-6 rounded-2xl grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-start gap-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#5B3A21]/80 uppercase">
            Profile
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#5B3A21]">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-500">
            {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Loading user..."}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 w-full">
          {data.map((ele, index) => (
            <div key={index} className="bg-[#f7f7f7] rounded-xl p-5">
              <p className="text-sm text-gray-500"> {ele.title} </p>
              <h3 className="font-semibold text-[#5B3A21] mt-2 break-all"> {ele.value} </h3>
            </div>
          ))}
        </div>
        <button
          onClick={logout}
          className="
            bg-red-500
            text-white
            px-8 py-3
            rounded-2xl
            hover:opacity-90
            transition
            cursor-pointer
          "
        >
          Logout
        </button>

      </div>
    </div>
  );
}