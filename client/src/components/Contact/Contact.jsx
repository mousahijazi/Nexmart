import { ContactForm, ContactLink } from '../../index'; 
import { useTranslations } from 'next-intl';
 
export default function ContactPage() { 
    const t = useTranslations("contact");

  return ( 
    <div className="bg-[var(--color-cream)] dark:bg-[var(--color-green-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink)] min-h-screen px-6 py-14 transition-colors duration-300"> 
        <div className="max-w-5xl mx-auto"> 
            <div className="text-center mb-16"> 
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-green)] dark:text-[var(--color-gold)]"> 
                {t("title")} 
            </h1> 
            <p className="text-lg max-w-xl mx-auto text-[var(--color-soft-2)] dark:text-[var(--color-soft)]"> 
                {t("Desc")}
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