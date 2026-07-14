import { ContactForm, ContactLink } from '@/index';

export default function ContactPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-zinc-950 text-[#5B3A21] dark:text-zinc-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[#5B3A21] dark:text-[#A68A64]">
                Get In Touch
            </h1>
            <p className="text-lg max-w-xl mx-auto text-stone-600 dark:text-stone-300">
                Have a question or feedback? We'd love to hear from you. Fill out the form or reach out via our channels.
            </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <ContactLink />
                <ContactForm />
            </div>
        </div>
    </div>
  );
}