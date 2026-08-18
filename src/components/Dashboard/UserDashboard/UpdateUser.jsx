"use client"
import { useState, useEffect } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { X, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/schemas/paymentSchema";
import { RHFerrors } from "@/index";
import { useTranslations } from "next-intl";

export default function UpdateUser({isModalOpen, setIsModalOpen}) {
  const {register, handleSubmit, reset, formState:{errors, isSubmitting}} = useForm({resolver: zodResolver(updateProfileSchema)});
  const { user, updateProfile } = useUserContext();
  const t = useTranslations();
  const [imageFile, setImageFile] = useState(null);
  const updating = isSubmitting;

  useEffect(() => {
    if (user) {
      reset({
          firstName: user.user_metadata.first_name,
          lastName: user.user_metadata.last_name,
          phone: user.user_metadata.phone || "",
      })
    }
  }, [user, isModalOpen, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
    }
  };

  const handleSave = async (data) => {

    const localPreviewUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    setIsModalOpen(false)

    const result = await updateProfile({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
    }, imageFile, localPreviewUrl);

    if (!result.success) {
      setIsModalOpen(true);
    }
  };

  const formFields = [
    {
      id: "first-name",
      label: t("auth.form.firstName.label"),
      type: "text",
      apiKey: "firstName",
      error: errors.firstName,
    },
    {
      id: "last-name",
      label: t("auth.form.lastName.label"),
      type: "text",
      apiKey: "lastName",
      error: errors.lastName,
    },
    {
      id: "phone-number",
      label: t("profile.data.phoneLabel"),
      type: "tel",
      apiKey: "phone",
      error: errors.phone,
      placeholder: "+970 595560240",
    }
  ];

  return (
    isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center mt-7 p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#18221f] w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[var(--color-border)] dark:border-[#22332e] relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#0E4D3A] dark:text-[#A7D0BF] flex items-center gap-2">
                    <Edit3 size={22} />
                    <span className="hidden min-[390px]:block">{t("profile.updateProfile.title")}</span>
                </h2>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="cursor-pointer text-gray-400 hover:text-[#0E4D3A] dark:hover:text-[#A7D0BF] transition-colors"
                    aria-label="close Model"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
              {formFields.map((ele, index) => (
                <div key={index}>
                    <label htmlFor={ele.id} className="block mb-1.5 text-sm font-semibold text-[#3C4A44] dark:text-gray-300">
                        {ele.label}
                    </label>
                    <input
                        id={ele.id}
                        type={ele.type}
                        {...register(ele.apiKey)}
                        placeholder={ele.placeholder || ""}
                        className="w-full text-[#3C4A44] dark:text-gray-100 bg-[#FAF9F4] dark:bg-[#121a17] font-semibold px-4 py-2.5 rounded-xl border border-[#E2E0D5] dark:border-[#22332e] outline-none focus:border-[#0E4D3A] dark:focus:border-[#A7D0BF] transition"
                    />
                    <RHFerrors errors={ele.error} />
                </div>
              ))}

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-[#3C4A44] dark:text-gray-300">
                  {t("profile.updateProfile.profileImage.title")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  placeholder={t("profile.updateProfile.profileImage.placeholder")}
                  className="cursor-pointer w-full text-[#3C4A44] dark:text-gray-100 bg-[#FAF9F4] dark:bg-[#121a17] font-semibold px-4 py-2.5 rounded-xl border border-[#E2E0D5] dark:border-[#22332e] outline-none focus:border-[#0E4D3A] dark:focus:border-[#A7D0BF] transition"
                />
              </div>

              <div className="pt-4 flex max-[390px]:flex-col gap-3">
                <button
                  type="button"
                  aria-label="cancel"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer w-full py-2.5 border border-[#E2E0D5] dark:border-[#22332e] rounded-xl font-medium text-[#3C4A44] dark:text-gray-300 bg-white dark:bg-[#18221f] hover:border-[#0E4D3A] dark:hover:border-[#A7D0BF] transition"
                >
                  {t("profile.updateProfile.cancel")}
                </button>
                <button
                  type="submit"
                  aria-label="save changes"
                  disabled={updating}
                  className="cursor-pointer w-full py-2.5 bg-[#0E4D3A] dark:bg-[#16382e] text-white dark:text-[#A7D0BF] rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {updating ? t("profile.updateProfile.savingButton") : t("profile.updateProfile.saveButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
  )
}