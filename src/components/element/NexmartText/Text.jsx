import { Link } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Youtube } from "react-bootstrap-icons"

export default function Text() {
  const t = useTranslations();

  const socialLinks = [
    {
      id: "facebook",
      icon: Facebook,
      link: "https://www.facebook.com/mwsy.ahmd.tnyn",
      label: "Facebook",
    },
    {
      id: "instagram",
      icon: Instagram,
      link: "https://www.instagram.com/mousaahmedhejazy/",
      label: "Instagram",
    },
    {
      id: "youtube",
      icon: Youtube,
      link: "https://www.youtube.com/@MousaEseady",
      label: "YouTube",
    },
  ];

  return (
    <div className="z-30 flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] shadow-sm hover:shadow-md transition duration-300 w-full max-w-sm mx-auto">
      <Link
        dir="ltr"
        href="/"
        className="text-2xl font-black tracking-tight text-[var(--color-green-dark)] dark:text-gray-100 hover:text-[var(--color-gold)] transition duration-300 flex items-center gap-2"
      >
        <span className="text-[var(--color-gold)]">⬡</span> Nexmart
      </Link>

      <p className="text-xs md:text-sm text-[var(--color-muted)] dark:text-gray-300 leading-relaxed max-w-[240px]">
        {t("cart.cartDashboard.brandInfo")}
      </p>

      <div className="w-12 h-[2px] bg-[var(--color-gold)]/40 rounded-full my-1"></div>

      <div className="flex items-center justify-center gap-3">
        {socialLinks.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="p-2.5 rounded-full bg-gray-50 dark:bg-[#121a17] border border-gray-100 dark:border-[#22332e] text-[var(--color-green-dark)] dark:text-gray-200 hover:text-[var(--color-gold)] dark:hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] dark:hover:border-[var(--color-gold)] hover:scale-110 hover:shadow-sm transition duration-300"
            >
              <IconComponent className="w-5 h-5 stroke-[1.75]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}