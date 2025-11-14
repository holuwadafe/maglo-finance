import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded-xl shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>

      {/* Recent Invoices Table Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-gray-200 dark:border-slate-700">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-4 p-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
