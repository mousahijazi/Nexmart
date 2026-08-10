import { Dashbaord } from "@/index";

export const metadata = {
  title: "Nexmart - profile",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function page() {
  return (
    <>
      <div className="bg-[#f2f2f2] dark:bg-zinc-800 pt-28 min-[500px]:px-6 min-[500px]:pt-32 sm:pt-40 pb-16">
          <div className="max-w-7xl mx-auto min-[500px]:px-6">
              <Dashbaord showData="userDashboard" /> 
          </div>
      </div>
      <div className="bg-[#f7f7f7] dark:bg-zinc-800 px-6 py-16">
          <div className="max-w-7xl mx-auto min-[500px]:px-6">
              <Dashbaord showData="orderDashboard" /> 
          </div>
      </div>
    </>
    
  )
}
