import { BlogListSkeleton } from "@/features/blog/components/BlogSkeletons";

export default function BlogLoading() {
  return (
    <div className="flex w-full flex-col bg-white">
      <section className="px-6 pt-6 pb-16 md:px-12 lg:px-20 lg:pt-8 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-12 max-w-xl">
            <div className="mb-6 h-8 w-28 animate-pulse rounded-full bg-[#EDE8F3]" />
            <div className="h-12 w-56 animate-pulse rounded-full bg-[#EDE8F3] sm:h-14" />
          </div>
          <BlogListSkeleton />
        </div>
      </section>
    </div>
  );
}
