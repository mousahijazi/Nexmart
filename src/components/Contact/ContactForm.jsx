"use client" 
import { useState } from 'react'; 
import { useAlertContext } from '@/Context/AlertProvider'; 
import { Send } from "lucide-react"; 
import { fieldsConfig } from './data'; 
import { useTranslations } from 'next-intl';
import emailjs from '@emailjs/browser'; 
 
export default function ContactForm() { 
  const t = useTranslations("contact.Form");
  const { showAlert } = useAlertContext(); 
  const [formData, setFormData] = useState({ name: '', email: '', message: '' }); 
  const [isSending, setIsSending] = useState(false); 
 
  const handleSubmit = (e) => { 
    e.preventDefault(); 
 
    if (!formData.name || !formData.email || !formData.message) { 
      showAlert("Please fill in all fields", "danger"); 
      return; 
    } 
 
    emailjs.send( 
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, 
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, 
      { 
        name: formData.name, 
        email: formData.email, 
        message: formData.message, 
      }, 
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY 
    ) 
    .then(() => { 
      showAlert("Message sent successfully! We will get back to you soon."); 
      setFormData({ name: '', email: '', message: '' }); 
    }) 
    .catch((error) => { 
      console.error("Failed to send email:", error); 
      showAlert("Something went wrong, please try again.", "danger"); 
    }) 
    .finally(() => { 
      setIsSending(false); 
    }) 
  }; 
 
  const handleChange = (key, value) => { 
    setFormData(prev => ({ 
      ...prev, 
      [key]: value 
    })); 
  }; 
 
  return ( 
    <> 
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[var(--color-surface)] dark:bg-[var(--color-green-dark)] p-4 xs:p-8 rounded-3xl shadow-xl border border-[var(--color-border)] dark:border-[var(--color-field)] space-y-6"> 
            {fieldsConfig.map((field) => ( 
                <div key={field.id}> 
                    <label className="block mb-2 text-sm font-semibold"> 
                        {t(field.label)} 
                    </label> 
                    <input 
                        type={field.type} 
                        value={formData[field.id]} 
                        onChange={(e) => handleChange(field.id, e.target.value)} 
                        placeholder={t(field.placeholder)} 
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-field)] dark:border-[var(--color-field)] bg-[var(--color-cream)] dark:bg-[var(--color-field)] outline-none focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)] transition" 
                    /> 
                </div> 
            ))} 
 
            <div> 
                <label className="block mb-2 text-sm font-semibold">{t("Message.label")}</label> 
                <textarea 
                rows={4} 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                placeholder={t("Message.placeholder")} 
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-field)] dark:border-[var(--color-field)] bg-[var(--color-cream)] dark:bg-[var(--color-field)] outline-none focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)] transition resize-none" 
                /> 
            </div> 
 
            <button className="w-full cursor-pointer py-3.5 bg-[var(--color-green)] hover:bg-[var(--color-green-dark)] text-white rounded-full font-medium transition flex items-center justify-center gap-2" aria-label="send a massage"> 
                <Send size={18} /> 
                <span>{isSending ? t("sendingButton") : t("sendButton")}</span> 
            </button> 
        </form> 
    </> 
  ) 
}