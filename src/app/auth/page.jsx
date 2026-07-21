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
    <div className="min-h-screen bg-[#F2f2f2] dark:bg-zinc-800 flex items-center justify-center px-3 min-[480px]:px-6 min-[480px]:py-40">
      <div className="w-full max-w-5xl min-[480px]:bg-white min-[480px]:dark:bg-zinc-950 min-[480px]:rounded-3xl overflow-hidden min-[480px]:shadow-md grid md:grid-cols-2">
        <LoginText isLogin={isLogin} />
        <LoginSiteDefinition />        
      </div>
    </div>
  );
}