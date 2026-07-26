"use client"
import { useUserContext } from "@/Context/UserProvider";
import { useState, useEffect } from "react";

export default function CheckoutForm() {
    const {user} = useUserContext();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        address: "",
        notes: "",
    });

    useEffect(() => {
        if (!user) return;

        setFormData(prev => ({
            ...prev,
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
            phone: user.user_metadata?.phone || "",
        }));
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const checkoutFields  = [
        {
            text: "First Name",
            id: "FirstName",
            name: "firstName",
            value: formData.firstName,
        },
        {
            text: "Last Name",
            id: "LastName",
            name: "lastName",
            value: formData.lastName,
        },
        {
            text: "Phone number",
            id: "PhoneNumber",
            name: "phone",
            value: formData.phone,
        },
        {
            text: "City",
            id: "City",
            name: "city",
            value: formData.city,
        },
    ];

  return (
    <div className="px-3 min-[480px]:px-6 py-8">
        <h1 className="pb-7 sm:pb-11 text-2xl sm:text-3xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">Shipping Address</h1>
        <form>
            <div className="grid min-[480px]:grid-cols-2 gap-4">
                {checkoutFields .map((ele) => (
                    <div key={ele.id}>
                        <label htmlFor={ele.id} className="block mb-2 pl-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">{ele.text}</label>
                        <input 
                            id={ele.id} 
                            name={ele.name}
                            value={ele.value}
                            onChange={handleChange}
                            type="text" 
                            placeholder={ele.text} 
                            className="
                                w-full
                                text-[#5B3A21] dark:text-zinc-700
                                dark:bg-[#f2f2f2]
                                font-semibold
                                px-4 py-3
                                rounded-xl
                                border-2 border-gray-200
                                outline-none
                                focus:border-[#5B3A21] dark:focus:border-zinc-700
                                transition
                            " 
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div className="">
                    <label htmlFor="address" className="block mb-2 pl-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">Address</label>
                    <input 
                        id="address" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Address" 
                        className="
                            w-full
                            text-[#5B3A21] dark:text-zinc-700
                            dark:bg-[#f2f2f2]
                            font-semibold
                            px-4 py-3
                            rounded-xl
                            border-2 border-gray-200
                            outline-none
                            focus:border-[#5B3A21] dark:focus:border-zinc-700
                            transition
                        " 
                    />
                </div>
                <div>
                    <label className="block mb-2 pl-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">Message</label>
                    <textarea
                        rows={4}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-[#fcfbf9] dark:bg-[#f2f2f2] outline-none focus:border-[#5B3A21] dark:focus:border-zinc-600 transition resize-none"
                    />
                </div>
            </div>
            <div className="mt-4 flex max-[480px]:flex-col-reverse gap-4">
                <button type="button" aria-label="cancel" className="p-3 border border-black dark:border-zinc-200 dark:bg-zinc-900 dark:text-white rounded-xl min-[480px]:w-1/2 cursor-pointer">cancel</button>
                <button type="button" aria-label="save address" className="p-3 bg-[#5B3A21] rounded-xl w-full cursor-pointer text-white">Save this Address</button>
            </div>
        </form>
    </div>
  )
}
