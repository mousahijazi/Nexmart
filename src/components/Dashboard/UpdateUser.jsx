"use client"
import { useState, useEffect } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { X, Edit3 } from "lucide-react";

export default function UpdateUser({isModalOpen, setIsModalOpen}) {
  const { user, updateProfile } = useUserContext();
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setTempFirstName(user?.user_metadata?.first_name || "");
      setTempLastName(user?.user_metadata?.last_name || "");
      setTempPhone(user?.user_metadata?.phone || "");
      setImageFile(null);
    }
  }, [user, isModalOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const localPreviewUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    setIsModalOpen(false)
    
    const result = await updateProfile({
      first_name: tempFirstName,
      last_name: tempLastName,
      phone: tempPhone,
    }, imageFile, localPreviewUrl);

    setUpdating(false);
    if (!result.success) {
      setIsModalOpen(true);
    }
  };

  const formFields = [
    {
      label: "First Name",
      type: "text",
      value: tempFirstName,
      onChange: (e) => setTempFirstName(e.target.value),
      required: true
    },
    {
      label: "Last Name",
      type: "text",
      value: tempLastName,
      onChange: (e) => setTempLastName(e.target.value),
      required: true
    },
    {
      label: "Phone Number",
      type: "tel",
      value: tempPhone,
      onChange: (e) => setTempPhone(e.target.value),
      placeholder: "+970 595560240",
      required: false
    }
  ];

  return (
    isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center mt-7 p-4 bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-800 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-zinc-700 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#5B3A21] dark:text-[#A68A64] flex items-center gap-2">
                    <Edit3 size={22} />
                    <span className="hidden min-[390px]:block">Edit Profile Information</span>
                </h2>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formFields.map((ele, index) => (
                <div key={index}>
                    <label className="block mb-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                        {ele.label}
                    </label>
                    <input
                        type={ele.type}
                        value={ele.value}
                        onChange={ele.onChange}
                        placeholder={ele.placeholder || ""}
                        className="w-full text-[#5B3A21] dark:text-zinc-700 dark:bg-gray-100 font-semibold px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5B3A21] transition"
                        required={ele.required}
                    />
                </div>
              ))}

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                  Avatar Image URL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  placeholder="Paste image URL here"
                  className="cursor-pointer w-full text-[#5B3A21] dark:text-zinc-700 dark:bg-gray-100 font-semibold px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5B3A21] transition"
                />
              </div>

              <div className="pt-4 flex max-[390px]:flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer w-full py-2.5 border border-gray-300 dark:border-zinc-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="cursor-pointer w-full py-2.5 bg-[#5B3A21] text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
  )
}
