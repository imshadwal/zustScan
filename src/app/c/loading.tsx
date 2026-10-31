import { GuestPageSkeleton } from "@/components/guest/guest-page-skeleton";
import { GuestShell } from "@/components/guest/shell";

export default function GuestTableLoading() {
  return (
    <GuestShell>
      <GuestPageSkeleton stepCount={4} />
    </GuestShell>
  );
}
