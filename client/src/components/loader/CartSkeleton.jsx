export default function CartSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-gray-100 rounded-3xl overflow-hidden h-[400px] flex flex-col justify-between p-4">
          <div className="w-full h-52 bg-gray-200 rounded-2xl"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
          <div className="h-8 bg-gray-200 rounded-tr-3xl w-24 mt-4"></div>
        </div>
      ))}
    </div>
  );
}