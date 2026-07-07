import Image from "next/image";
import { Button } from "@/index";

export default function AboutPage() {
  return (
    <>
      <section className="text-center py-24">
          <span className="uppercase tracking-[4px] text-sm text-[#5B3A21]/60 font-bold">
              About Us
          </span>

          <h1 className="mt-4 text-5xl font-extrabold text-[#5B3A21]">
              Shopping Made Simple.
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-gray-500 text-lg leading-8">
              Nexmart was built with one goal in mind:
              delivering premium products with a clean,
              modern shopping experience that feels fast,
              simple and enjoyable.
          </p>
      </section>
      <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="rounded-3xl overflow-hidden">
              <Image
                  src="/landing-image.jpg"
                  width={700}
                  height={600}
                  className="w-full h-full object-cover"
                  alt=""
              />
          </div>

          <div>

              <span className="uppercase text-sm tracking-widest text-[#5B3A21]/60">
                  Our Story
              </span>

              <h2 className="text-4xl font-bold text-[#5B3A21] mt-3">
                  We Believe Shopping Should Feel Effortless.
              </h2>

              <p className="mt-6 text-gray-600 leading-8">
                  Our mission is to combine quality products,
                  modern technology and elegant design into one
                  seamless shopping experience.
              </p>

          </div>

      </div>
    </>
    // <div className="bg-[#F7F4EF] py-24 sm:py-36 lg:py-44 px-3 sm:px-6 md:px-12">
    //   <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
    //     <div className="flex flex-col justify-center">
    //       <div className="space-y-3">
    //         <span className="text-sm font-bold tracking-wide text-[#5B3A21]/65">
    //           About Us
    //         </span>
    //         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#5B3A21] leading-tight">
    //           Our Story
    //         </h1>
    //         <p className="text-gray-500 text-[17px] max-w-md">
    //           We're Mousa and Routi, passionate about creating a seamless and enjoyable shopping experience.  Inspired by the need for reliable and trustworthy products, we’ve built this platform to connect you with high-quality items delivered directly to your door. We believe in transparency, excellent customer service, and making online shopping easy and convenient.
    //         </p>
    //         <Button title="Shop Now" link="products" />
    //       </div>
    //     </div>
    //     <div className="hidden lg:flex justify-center">
    //         <Image
    //             src="/landing-image.jpg"
    //             alt="Medicine products"
    //             width={550}
    //             height={550}
    //             className="w-full shadow-md max-w-lg object-contain rounded-3xl duration-300 hover:-translate-y-4 hover:shadow-xl"
    //             priority
    //         />
    //     </div>
    //   </div>
    // </div>
  );
}