import { Inter } from "next/font/google";
import { Header, Footer, ContextProviders } from "@/index";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexmart - Home",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#F7F4EF] dark:bg-zinc-900`}>
        <ContextProviders>
          <Header />
          <main>
            {children}
          </main>
          <Footer /> 
        </ContextProviders>
      </body>
    </html>
  );
}
