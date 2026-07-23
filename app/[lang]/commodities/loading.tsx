import { CardGridSkeleton, PageHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="bg-navy-50/40">
      <PageHeaderSkeleton />
      <div className="container-site grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <div className="h-fit space-y-4 rounded-xl border border-navy-100 bg-white p-5 shadow-card">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <CardGridSkeleton />
      </div>
    </div>
  );
}
