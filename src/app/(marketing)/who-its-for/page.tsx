import { redirect } from "next/navigation";
import { productPagePath } from "@/lib/site";

export default function WhoItsForRedirectPage() {
  redirect(productPagePath);
}
