function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse bg-[#EDE8F3] ${className}`} />;
}

export function BlogCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <Pulse className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-4">
        <Pulse className="mb-3 h-3 w-24 rounded-full" />
        <Pulse className="mb-2 h-5 w-4/5 rounded-full" />
        <Pulse className="mb-3 h-3 w-20 rounded-full" />
        <Pulse className="mb-2 h-3 w-full rounded-full" />
        <Pulse className="h-3 w-2/3 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 p-4">
        <Pulse className="h-9 w-24 rounded-full" />
        <Pulse className="h-4 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function BlogListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BlogArticleSkeleton() {
  return (
    <div className="flex w-full flex-col bg-[#fcfcfc]">
      <div className="px-6 pt-6 pb-16 md:px-12 lg:px-20 lg:pt-8 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Pulse className="h-10 w-36 rounded-full" />
            <Pulse className="h-10 w-28 rounded-full" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
            <div className="grid lg:grid-cols-2">
              <Pulse className="min-h-[280px] w-full lg:min-h-[520px]" />
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <Pulse className="mb-5 h-8 w-24 rounded-full" />
                <Pulse className="mb-3 h-10 w-full rounded-full" />
                <Pulse className="mb-6 h-10 w-3/4 rounded-full" />
                <Pulse className="mb-6 h-4 w-48 rounded-full" />
                <Pulse className="mb-2 h-4 w-full rounded-full" />
                <Pulse className="mb-2 h-4 w-full rounded-full" />
                <Pulse className="h-4 w-2/3 rounded-full" />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-gray-100 bg-white px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <Pulse className="mb-8 h-8 w-48 rounded-full" />
            <Pulse className="mb-3 h-4 w-full rounded-full" />
            <Pulse className="mb-3 h-4 w-full rounded-full" />
            <Pulse className="mb-3 h-4 w-5/6 rounded-full" />
            <Pulse className="mb-3 h-4 w-full rounded-full" />
            <Pulse className="h-4 w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
