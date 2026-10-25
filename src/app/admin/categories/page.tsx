import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { CategoryManager } from "@/components/admin/category-manager";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { hasAdminSession } from "@/lib/admin-session";
import { listBusinessCategoryOptions } from "@/lib/business-category-options";
import { OwnerStoreError } from "@/lib/store-error";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<LogoSpinnerPage theme="dark" />}>
      <CategoriesGate />
    </Suspense>
  );
}

async function CategoriesGate() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  let categories: Awaited<ReturnType<typeof listBusinessCategoryOptions>> = [];
  let notice: string | null = null;
  try {
    categories = await listBusinessCategoryOptions();
  } catch (error) {
    notice =
      error instanceof OwnerStoreError
        ? error.message
        : "Categories could not be loaded.";
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-white">Business categories</h1>
        <div className="mt-6">
          <CategoryManager initialCategories={categories} notice={notice} />
        </div>
      </main>
    </>
  );
}
