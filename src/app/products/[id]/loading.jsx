export default function loading() {
  return (
    <div className="bg-[#f1f1f1] py-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-2xl py-12 px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-12">

            <div className="h-[500px] bg-gray-200 animate-pulse rounded-xl" />

            <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-40 bg-gray-200 rounded animate-pulse" />
            </div>

            </div>
        </div>
    </div>
  )
}
