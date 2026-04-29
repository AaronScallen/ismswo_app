export default function PortalLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <div className="h-56 animate-pulse rounded-[2rem] border border-[var(--line)] bg-white/6" />
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-[2rem] border border-[var(--line)] bg-white/6" />
        <div className="h-72 animate-pulse rounded-[2rem] border border-[var(--line)] bg-white/6" />
      </div>
    </main>
  );
}
