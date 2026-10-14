export default function PageSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-[var(--color-cream)] p-6 animate-pulse">
      <div className="hidden lg:block w-64 shrink-0 space-y-4 pr-6 border-r border-[var(--color-divider)]">
        <div className="h-10 w-32 rounded-xl bg-[var(--color-sand)]" />
        <div className="space-y-2 pt-4">
          <div className="h-9 w-full rounded-lg bg-[var(--color-sand)]" />
          <div className="h-9 w-full rounded-lg bg-[var(--color-sand)]" />
          <div className="h-9 w-full rounded-lg bg-[var(--color-sand)]" />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 rounded-lg bg-[var(--color-sand)]" />
          <div className="h-10 w-10 rounded-full bg-[var(--color-sand)]" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-[var(--color-sand)]" />
          <div className="h-28 rounded-2xl bg-[var(--color-sand)]" />
          <div className="h-28 rounded-2xl bg-[var(--color-sand)]" />
        </div>

        <div className="h-[400px] w-full rounded-2xl bg-[var(--color-sand)]" />
      </div>
    </div>
  );
}