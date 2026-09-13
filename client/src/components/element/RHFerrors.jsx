export default function RHFerrors({errors}) {
  return (
    <>
        {errors && (
            <p className="mt-2 text-[#5B3A21]/80 dark:text-zinc-300 font-semibold text-sm">
                {errors.message}
            </p>
        )}
    </>
  )
}
