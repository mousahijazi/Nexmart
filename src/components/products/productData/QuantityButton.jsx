export default function QuantityButton({Text, action}) {
  return (
    <button className="cursor-pointer w-10 h-10 rounded-full bg-gray-200 dark:bg-[#A68A64] dark:text-white" onClick={action}>
        {Text}
    </button>
  )
}
