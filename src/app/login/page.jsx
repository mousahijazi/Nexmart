import { LoginText, LoginSiteDefinition } from "@/index";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F2f2f2] dark:bg-zinc-800 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-3xl shadow-md grid md:grid-cols-2">
        <LoginText />
        <LoginSiteDefinition />        
      </div>
    </div>
  );
}