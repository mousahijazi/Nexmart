import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#F7F4EF] flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-6xl sm:text-8xl font-extrabold text-[#5B3A21]"> 404 </h1>
        <h2 className="mt-5 text-3xl font-bold text-[#5B3A21]"> Page Not Found </h2>
        <p className="mt-4 text-gray-500"> The page you are looking for doesn't exist or has been moved. </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="
              bg-[#5B3A21]
              text-white
              px-7 py-3
              rounded-2xl
              hover:opacity-90
              transition
            "
          >
            Back Home
          </Link>
          
          <Link
            href="/products"
            className="
              border-2 border-[#5B3A21]
              text-[#5B3A21]
              px-7 py-3
              rounded-2xl
              hover:bg-[#5B3A21]
              hover:text-white
              transition
            "
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}