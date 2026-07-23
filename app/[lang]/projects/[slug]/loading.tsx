import { PageHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="bg-navy-50/40 pb-20">
      <PageHeaderSkeleton />
      <div className="container-site mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Skeleton className="h-80 w-full rounded-2xl sm:h-[440px]" />
          <div className="space-y-3 rounded-xl border border-navy-100 bg-white p-7 shadow-card">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border border-navy-100 bg-white p-6 shadow-card">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
