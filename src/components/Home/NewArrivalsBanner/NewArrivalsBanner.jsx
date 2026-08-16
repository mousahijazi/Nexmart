import { getProducts } from "@/helper/fetchApi";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import Image from "next/image";

export default async function NewArrivalsBanner() {
    const t = await getTranslations("home.NewArrivalsBanner");
    const products = await getProducts(3);
    const data = products.products;

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="rounded-[22px] overflow-hidden min-[480px]:px-6 bg-[var(--color-sand)] grid grid-cols-1 lg:grid-cols-2 items-center min-h-[260px]">
            <div className="p-2 min-[480px]:p-8 md:p-11">
                <div className="text-[var(--color-muted)] text-[13px] tracking-[.1em] mb-3">{t("title")}</div>
                <h2 className="font-bold text-[32px] mb-[14px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] leading-[1.4]">{t("secondTitle")}</h2>
                <p className="text-[var(--color-soft-2)] text-[15px] leading-[1.85] m-0 mb-6 max-w-[380px]">{t("Desc")}</p>
                <div className="inline-block bg-[var(--color-green)] text-white px-[30px] py-[13px] rounded-[11px] text-[14.5px] cursor-pointer hover:bg-[var(--color-green-dark)]">{t("button")}</div>
            </div>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-3 p-6">
                    {data.map((ele, index) => (
                        <div key={index} className="bg-white dark:bg-[var(--color-muted)] rounded-[14px] p-3">
                            <div className="relative group h-[120px] mb-5">
                                <Link href={`/products/${ele.id}`}>
                                    <Image
                                        src={ele.thumbnail}
                                        alt={ele.title}
                                        fill
                                        priority
                                        className="cursor-pointer object-contain p-3 bg-black/20 dark:bg-black/40 rounded-xl group-hover:bg-black/10 group-hover:scale-95 transition duration-300"
                                    />
                                </Link>
                            </div>
                            <div className="text-[12.5px] font-semibold leading-[1.5] line-clamp-2 min-h-[38px]">{ele.title}</div>
                            <div className="text-[13px] font-bold text-[var(--color-green)] dark:text-white">{ele.price} ر.س</div>
                        </div>
                    ))}
            </div>
        </div>
    </section>
  )
}
