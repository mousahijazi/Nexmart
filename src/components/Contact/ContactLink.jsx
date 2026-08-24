import { Link } from "@/lib/i18n/routing"; 
import { LinkData } from "./data"; 
import { Text } from "@/index"; 
import { useTranslations } from "next-intl";
 
export default function ContactLink() { 
    const t = useTranslations("contact.Data");

  return ( 
    <> 
        <div className="lg:col-span-5 space-y-8 bg-[var(--color-surface)] dark:bg-[var(--color-green-dark)] p-8 rounded-3xl shadow-xl border border-[var(--color-border)] dark:border-[var(--color-field)]"> 
            <h2 className="text-2xl font-bold mb-4">{t("title")}</h2> 
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6"> 
                <div className="flex flex-col gap-6"> 
                    {LinkData.map((ele, index) => ( 
                        <div className="flex items-start gap-4" key={index}> 
                            <div className="p-3 bg-[var(--color-green)]/10 dark:bg-[var(--color-gold)]/10 rounded-xl text-[var(--color-green)] dark:text-[var(--color-gold)]"> 
                                {ele.icon} 
                            </div> 
                            <div> 
                                <p className="font-semibold text-sm text-[var(--color-soft-2)] dark:text-[var(--color-soft)]">{t(ele.title)}</p> 
                                <Link href={ele.link} dir={ele.isTranslationText ? "rtl" : "ltr"} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium break-all sm:break-normal">{ele.isTranslationText ? t(ele.text) : ele.text}</Link> 
                            </div> 
                        </div> 
                    ))} 
                </div> 
                <div className="hidden md:block"> 
                    <Text /> 
                </div> 
            </div> 
        </div> 
    </> 
  ) 
}