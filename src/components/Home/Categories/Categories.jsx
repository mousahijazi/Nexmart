import { getCategories } from "@/helper/fetchApi";
import { CategoriesSlider } from "@/index";

export default async function Categories() {
  const categories = await getCategories();

  return (
    <section className="bg-[#F7F4EF] dark:bg-zinc-950 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Shop by Categories
          </h2>
          <p className="max-w-md text-zinc-600 dark:text-zinc-400">
            Discover our curated collections, crafted for every taste.
          </p>
        </div>

        <CategoriesSlider categories={categories} />
      </div>
    </section>
  )
}
