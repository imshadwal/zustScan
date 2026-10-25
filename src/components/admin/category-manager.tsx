"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  fieldClass,
  primaryButtonClass,
  quietButtonClass,
} from "@/components/admin/styles";
import { useToast } from "@/components/toast/toast-provider";
import type { BusinessCategoryOption } from "@/lib/business-categories";

type CategoryRow = BusinessCategoryOption;

export function CategoryManager({
  initialCategories,
  notice,
}: {
  initialCategories: CategoryRow[];
  notice: string | null;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [newLabel, setNewLabel] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);

  async function refreshList() {
    const response = await fetch("/api/admin/categories", { cache: "no-store" });
    const body = (await response.json().catch(() => null)) as {
      categories?: CategoryRow[];
    } | null;
    if (response.ok && body?.categories) {
      setCategories(body.categories);
    }
    router.refresh();
  }

  async function createCategory(event: FormEvent) {
    event.preventDefault();
    setCreatePending(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        const message = body?.error ?? "Category could not be added.";
        toastError(message);
        setCreatePending(false);
        return;
      }
      success("Category added.");
      setNewLabel("");
      setCreatePending(false);
      await refreshList();
    } catch {
      toastError("The request could not be sent.");
      setCreatePending(false);
    }
  }

  async function saveRow(row: CategoryRow) {
    setPendingId(row.id);
    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(row.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: row.label,
          sortOrder: row.sortOrder,
        }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        toastError(body?.error ?? "Category could not be saved.");
        setPendingId(null);
        return;
      }
      success("Category saved.");
      setPendingId(null);
      await refreshList();
    } catch {
      toastError("The request could not be sent.");
      setPendingId(null);
    }
  }

  async function removeRow(id: string) {
    if (!window.confirm("Delete this category? It must not be used by any business owner.")) {
      return;
    }
    setPendingId(id);
    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        toastError(body?.error ?? "Category could not be deleted.");
        setPendingId(null);
        return;
      }
      success("Category deleted.");
      setPendingId(null);
      await refreshList();
    } catch {
      toastError("The request could not be sent.");
      setPendingId(null);
    }
  }

  function updateLocal(id: string, patch: Partial<CategoryRow>) {
    setCategories((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  return (
    <div className="space-y-8">
      {notice ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {notice}
        </p>
      ) : null}

      <p className="text-sm leading-6 text-white/70">
        Categories appear in every business owner&apos;s profile dropdown. &quot;Why trust us&quot;
        is generated with AI on the profile page — not from templates here.
      </p>

      <ul className="space-y-4">
        {categories.map((row) => (
          <li
            key={row.id}
            className="rounded-3xl bg-white p-5 text-ink shadow-[0_12px_40px_rgba(7,20,40,0.08)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                Id: {row.id}
                {row.isOthers ? " · fixed" : ""}
              </p>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted">Order</span>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={row.sortOrder}
                  onChange={(e) =>
                    updateLocal(row.id, { sortOrder: Number(e.target.value) || 0 })
                  }
                  className={`${fieldClass} w-20 py-1.5 text-sm`}
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-semibold" htmlFor={`label-${row.id}`}>
              Label
            </label>
            <input
              id={`label-${row.id}`}
              value={row.label}
              onChange={(e) => updateLocal(row.id, { label: e.target.value })}
              className={`${fieldClass} mt-2`}
              maxLength={80}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={primaryButtonClass}
                disabled={pendingId === row.id}
                onClick={() => saveRow(row)}
              >
                {pendingId === row.id ? "Saving…" : "Save"}
              </button>
              {!row.isOthers ? (
                <button
                  type="button"
                  className={quietButtonClass}
                  disabled={pendingId === row.id}
                  onClick={() => removeRow(row.id)}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={createCategory}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white sm:p-8"
      >
        <h2 className="text-lg font-semibold">Add category</h2>
        <p className="mt-2 text-sm text-white/65">
          A URL-safe id is created from the label (e.g. &quot;Fitness Studio&quot; →
          fitness-studio).
        </p>
        <label className="mt-5 block text-sm font-semibold" htmlFor="new-category-label">
          Label
        </label>
        <input
          id="new-category-label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className={`${fieldClass} mt-2 text-ink`}
          required
          minLength={2}
          maxLength={80}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className={primaryButtonClass} disabled={createPending}>
            {createPending ? "Adding…" : "Add category"}
          </button>
          <Link href="/admin" className={quietButtonClass}>
            Back to owners
          </Link>
        </div>
      </form>
    </div>
  );
}
