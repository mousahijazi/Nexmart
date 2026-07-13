import { ProductsPage } from "@/index";

export const metadata = {
  title: "Nexmart - shop",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function page() {
  return (
    <div>
      <ProductsPage />
    </div>
  )
}
