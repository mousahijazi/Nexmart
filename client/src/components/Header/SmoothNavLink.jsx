"use client";
import { Link } from "../../lib/i18n/routing";
import { usePathname } from "next/navigation";

export default function SmoothNavLink({ href, targetId, children, className }) {
  const pathname = usePathname();

  const handleClick = (e) => {
    const isHomePage = pathname === "/" || pathname === "/ar" || pathname === "/en";

    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}