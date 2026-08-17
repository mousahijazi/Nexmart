import { Dashbaord } from "@/index";

export const metadata = {
  title: "Nexmart - profile",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function page() {
  return (
    <div className="sm:px-6">
        <div className="max-w-7xl mx-auto sm:px-6">
            <Dashbaord showData="userDashboard" /> 
        </div>
    </div>
  )
}
