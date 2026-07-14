"use client"
import { useState } from 'react';
import { useAlertContext } from '@/Context/AlertProvider';
import { Send } from "lucide-react";
import { fieldsConfig } from './data';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const { showAlert } = useAlertContext();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Keys from code:", {
      service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      key: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    });

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
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-stone-200/60 dark:border-zinc-800 space-y-6">
            {fieldsConfig.map((field) => (
                <div key={field.id}>
                    <label className="block mb-2 text-sm font-semibold">
                        {field.label}
                    </label>
                    <input
                        type={field.type}
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-[#fcfbf9] dark:bg-zinc-800 outline-none focus:border-[#5B3A21] dark:focus:border-zinc-600 transition"
                    />
                </div>
            ))}

            <div>
                <label className="block mb-2 text-sm font-semibold">Message</label>
                <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-[#fcfbf9] dark:bg-zinc-800 outline-none focus:border-[#5B3A21] dark:focus:border-zinc-600 transition resize-none"
                />
            </div>

            <button className="w-full cursor-pointer py-3.5 bg-[#5B3A21] hover:bg-[#5B3A21]/90 text-white rounded-full font-medium transition flex items-center justify-center gap-2">
                <Send size={18} />
                <span>{isSending ? "Sending..." : "Send Message"}</span>
            </button>
        </form>
    </>
  )
}
