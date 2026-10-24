import { redirect } from "next/navigation";

export default function LegacyNewCustomerPage() {
  redirect("/admin/owners/new");
}
