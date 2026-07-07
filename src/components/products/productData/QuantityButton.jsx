export default function QuantityButton({Text, action}) {
  return (
    <button className="cursor-pointer w-10 h-10 rounded-full bg-gray-100" onClick={action}>
        {Text}
    </button>
  )
}
