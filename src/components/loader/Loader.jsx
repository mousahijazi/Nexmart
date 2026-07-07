export default function Loader() {
  const dataLoader = [
    {
      delay: "",
    },
    {
      delay: "[animation-delay:0.3s]",
    },
    {
      delay: "[animation-delay:0.6s]",
    },
  ]

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      {dataLoader.map((ele, index) => (
        <div key={index} className={`w-5 h-5 bg-fuchsia-500 rounded-full mx-1 animate-[up-and-down_0.9s_infinite_alternate] ${ele.delay}`}></div>
      ))}
    </div>
  )
}
