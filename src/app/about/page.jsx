import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-zinc-950 text-[#5B3A21] dark:text-zinc-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[#5B3A21] dark:text-[#A68A64]">
            Our Story at Nexmart
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-stone-600 dark:text-stone-300 leading-relaxed">
            We believe that shopping shouldn't just be about buying, but an experience of luxury, simplicity, and trust.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold border-b-2 border-[#A68A64] pb-2 inline-block">
              Who We Are
            </h2>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              At Nexmart, we curate the finest products crafted with passion. Our mission is to bridge the gap between premium quality and exceptional digital shopping convenience. Every item in our store is handpicked to elevate your lifestyle.
            </p>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              We started with a simple vision: to create a curated marketplace where trust is our currency and customer satisfaction is our absolute priority.
            </p>
          </div>
          
         <div className="hidden lg:block relative h-96 rounded-2xl shadow-2xl overflow-hidden group">
              <Image
                src="/landing-image.jpg"
                alt="Nexmart Brand Store"
                fill
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 z-10 text-white">
                <span className="text-xs uppercase tracking-widest text-stone-300 font-semibold">
                  Established 2026
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 leading-tight">
                  Crafting Excellence Every Single Day
                </h3>
                <p className="text-sm text-stone-200 mt-2 line-clamp-2">
                  Providing you with the absolute best shopping experience from the comfort of your home.
                </p>
              </div>
            </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 shadow-xl dark:shadow-black/40 border border-stone-200/60 dark:border-zinc-800">
          <h3 className="text-2xl font-bold text-center mb-10 text-[#5B3A21] dark:text-[#A68A64]">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-4">
              <div className="text-3xl">🛡️</div>
              <h4 className="font-bold text-lg">Uncompromised Trust</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400">We guarantee authentic products and absolutely secure payment methods.</p>
            </div>

            <div className="text-center space-y-3 p-4">
              <div className="text-3xl">✨</div>
              <h4 className="font-bold text-lg">Premium Selection</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400">Only the highest quality items make it to our digital shelves.</p>
            </div>

            <div className="text-center space-y-3 p-4">
              <div className="text-3xl">🚀</div>
              <h4 className="font-bold text-lg">Seamless Experience</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400">A fast, modern website crafted to make shopping effortless.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}