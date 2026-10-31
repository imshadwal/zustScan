import { GuestPageSkeleton } from "@/components/guest/guest-page-skeleton";
import { GuestShell } from "@/components/guest/shell";

export default function GuestEventLoading() {
  return (
    <GuestShell>
      <GuestPageSkeleton stepCount={3} />
    </GuestShell>
  );
}
