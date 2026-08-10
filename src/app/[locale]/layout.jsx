import { Inter, Cairo } from "next/font/google";
import { Header, Footer, ContextProviders } from "@/index";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({ 
  subsets: ["arabic"],
  display: "swap",
});
export const metadata = {
  title: "Nexmart - Home",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  const selectedFont = locale === "ar" ? cairo.className : inter.className;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="h-full antialiased">
      <body className={`${selectedFont} min-h-screen flex flex-col bg-[#F7F4EF] dark:bg-zinc-900`}>
        <NextIntlClientProvider messages={messages}>
          <ContextProviders>
            <Header />
            <main>
              {children}
            </main>
            <Footer /> 
          </ContextProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
