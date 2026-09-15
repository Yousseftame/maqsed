export default function PublicLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] animate-pulse px-6 py-24 md:px-12 lg:px-20" aria-hidden>
      <div className="h-10 w-48 rounded-full bg-gray-100" />
      <div className="mt-8 h-16 max-w-xl rounded-2xl bg-gray-100" />
      <div className="mt-10 h-72 rounded-3xl bg-gray-100" />
    </div>
  );
}
