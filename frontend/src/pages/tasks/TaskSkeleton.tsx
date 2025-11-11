import { Skeleton } from "@/components/ui/skeleton";

export default function TaskSkeleton() {
  return [1, 2, 3].map(idx => <Skeleton key={idx} className="w-40 h-40"/>);
}