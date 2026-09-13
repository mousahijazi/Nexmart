"use client"
import { useTranslations } from "next-intl";
import { subscribeToNewsletter } from "../../../helper/fetchApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscribeToNewsletter } from "../../../lib/schemas/paymentSchema";
import { useAlertContext } from "../../../Context/AlertProvider";
import { useUserContext } from "../../../Context/UserProvider";
import emailjs from "@emailjs/browser";

export default function NewsletterForm() {
    const t = useTranslations("home.NewsletterBanner");
    const {user, loading} = useUserContext();
    const {showAlert} = useAlertContext();
    const {register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({resolver: zodResolver(SubscribeToNewsletter)});

    const handleSubscribe = async (userEmail) => {
        const result = await subscribeToNewsletter(userEmail.email);

        if (result.success) {
            showAlert("تمت الإضافة بنجاح!");
            const userName = loading ? "" : (user?.user_metadata?.first_name || "عزيزنا العميل");
            
            emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_TWO_ID,
                {
                    to_email: userEmail.email,
                    from_name: userName,
                    welcome_message: `أهلاً بك ${userName} في نشرتنا البريدية!`,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            ).then(() => {
                showAlert("تم إرسال إيميل الترحيب بنجاح!");
            })
            .catch((error) => {
                console.error("Failed to send email:", error);
                showAlert("Something went wrong, please try again.", "danger");
            })

            reset();
        } else {
            showAlert(result.message, "danger")
        }
    };

  return (
    <form onSubmit={handleSubmit(handleSubscribe)} className="relative flex max-xs:flex-col gap-3 xs:bg-white/8 xs:border border-white/16 xs:rounded-[14px] p-2">
        <input 
            placeholder={
                errors.email?.message 
                    ? errors.email.message 
                    : t("Input.placeholder")
            }
            {...register("email")} 
            className={`flex-1 max-xs:py-4 bg-transparent border border-[var(--color-border)] rounded-2xl xs:border-0 outline-none ${errors.email ? "text-red-400 placeholder:text-red-400" : "text-white"} text-[14.5px] px-[14px]`} 
        />
        <button 
            type="submit" 
            aria-label={t("Input.label")} 
            className="bg-[var(--color-gold)] text-[var(--color-green-dark)] font-bold px-7 py-[13px] rounded-[10px] cursor-pointer text-[14.5px] whitespace-nowrap hover:bg-[var(--color-gold-light)]"
        >
            {isSubmitting ? "..." : t("Input.label")}
        </button>
    </form>
  )
}
