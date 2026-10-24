import { GuestShell } from "@/components/guest/shell";

export default function CustomerNotFound() {
  return (
    <GuestShell>
      <h1 className="text-2xl font-semibold">This QR is not active.</h1>
      <p className="mt-3 text-muted">Check the code with the business.</p>
    </GuestShell>
  );
}
