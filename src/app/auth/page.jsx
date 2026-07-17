import { LoginText, LoginSiteDefinition } from "@/index";

export const metadata = {
  title: "Nexmart - login",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default async function LoginPage({searchParams}) {
  const resolvedParams = await searchParams;
  const mode = resolvedParams?.mode || "login";
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#F2f2f2] dark:bg-zinc-800 flex items-center justify-center px-6 py-40">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden shadow-md grid md:grid-cols-2">
        <LoginText isLogin={isLogin} />
        <LoginSiteDefinition />        
      </div>
    </div>
  );
}