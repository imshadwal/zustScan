"use client";

import { useState, type KeyboardEvent } from "react";
import { fieldClass, primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import { useToast } from "@/components/toast/toast-provider";

type Product = { id: string; name: string };
type Service = { id: string; name: string; products: Product[] };

function productPlaceholder(serviceName: string) {
  const sample = serviceName.toLowerCase();
  if (sample.includes("social")) return "Instagram management";
  if (sample.includes("seo") || sample.includes("content")) return "Blog writing";
  if (sample.includes("performance") || sample.includes("ads")) return "Google ads";
  if (sample.includes("brand")) return "Social creatives";
  return "Product name";
}

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const { success, error: toastError } = useToast();
  const [services, setServices] = useState(initialServices);
  const [serviceName, setServiceName] = useState("");
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [draftProducts, setDraftProducts] = useState<Record<string, string[]>>({});
  const [addingToServiceId, setAddingToServiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const productTotal = services.reduce((sum, service) => sum + service.products.length, 0);

  async function reloadFromServer() {
    const response = await fetch("/api/business/services", { cache: "no-store" });
    const body = (await response.json().catch(() => null)) as { services?: Service[] } | null;
    if (body?.services) setServices(body.services);
  }

  async function addService() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/business/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ name: serviceName }),
      });
      const body = (await response.json().catch(() => null)) as
        | { service?: { id: string; name: string }; error?: string }
        | null;
      if (!response.ok || !body?.service) {
        const message = body?.error ?? "The service could not be added.";
        setError(message);
        toastError(message);
        setPending(false);
        return;
      }
      setServiceName("");
      setServices((prev) => [
        ...prev,
        { id: body.service!.id, name: body.service!.name, products: [] },
      ]);
      success("Service saved.");
      setAddingToServiceId(body.service.id);
      setPending(false);
    } catch {
      const message = "The request could not be sent.";
      setError(message);
      toastError(message);
      setPending(false);
    }
  }

  async function removeService(serviceId: string, name: string) {
    if (!confirm(`Delete “${name}” and all its products?`)) return;
    setPending(true);
    if (addingToServiceId === serviceId) setAddingToServiceId(null);
    await fetch(`/api/business/services/${serviceId}`, { method: "DELETE" });
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
    success("Service removed.");
    setPending(false);
  }

  function queueProduct(serviceId: string) {
    const name = productNames[serviceId]?.trim();
    if (!name) return;
    setDraftProducts((prev) => {
      const list = prev[serviceId] ?? [];
      const exists = list.some((item) => item.toLowerCase() === name.toLowerCase());
      if (exists) return prev;
      return { ...prev, [serviceId]: [...list, name] };
    });
    setProductNames((prev) => ({ ...prev, [serviceId]: "" }));
  }

  function removeDraftProduct(serviceId: string, index: number) {
    setDraftProducts((prev) => {
      const list = prev[serviceId] ?? [];
      return { ...prev, [serviceId]: list.filter((_, i) => i !== index) };
    });
  }

  function onProductKeyDown(event: KeyboardEvent<HTMLInputElement>, serviceId: string) {
    if (event.key === "Enter") {
      event.preventDefault();
      queueProduct(serviceId);
    }
  }

  async function saveAllProducts(serviceId: string) {
    const names = draftProducts[serviceId] ?? [];
    if (names.length === 0) return;
    setError(null);
    setPending(true);
    try {
      const response = await fetch(`/api/business/services/${serviceId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ names }),
      });
      const body = (await response.json().catch(() => null)) as
        | { products?: Product[]; error?: string }
        | null;
      if (!response.ok || !body?.products) {
        const message = body?.error ?? "Products could not be saved.";
        setError(message);
        toastError(message);
        await reloadFromServer();
        setPending(false);
        return;
      }
      const saved = body.products.map((product) => ({ id: product.id, name: product.name }));
      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId
            ? { ...service, products: [...service.products, ...saved] }
            : service,
        ),
      );
      setDraftProducts((prev) => ({ ...prev, [serviceId]: [] }));
      setAddingToServiceId(null);
      success(
        saved.length === 1 ? "Product saved." : `${saved.length} products saved.`,
      );
      setPending(false);
    } catch {
      const message = "The request could not be sent.";
      setError(message);
      toastError(message);
      setPending(false);
    }
  }

  async function removeProduct(serviceId: string, productId: string) {
    setPending(true);
    await fetch(`/api/business/products/${productId}`, { method: "DELETE" });
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              products: service.products.filter((product) => product.id !== productId),
            }
          : service,
      ),
    );
    success("Product removed.");
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/90">
          {services.length} service{services.length === 1 ? "" : "s"}
        </span>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/90">
          {productTotal} product{productTotal === 1 ? "" : "s"}
        </span>
      </div>

      {error ? (
        <p className="text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}

      <section className="rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
        <h2 className="text-sm font-semibold text-muted">New service</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && serviceName.trim()) {
                e.preventDefault();
                addService();
              }
            }}
            placeholder="Social media marketing"
            className={fieldClass}
            disabled={pending}
          />
          <button
            type="button"
            onClick={addService}
            disabled={pending || !serviceName.trim()}
            className={`${primaryButtonClass} shrink-0`}
          >
            Add service
          </button>
        </div>
      </section>

      {services.length === 0 ? (
        <p className="text-center text-sm text-white/70">
          Add a service above. Each one becomes its own card where you add products.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const draft = draftProducts[service.id] ?? [];
            const isAdding = addingToServiceId === service.id;
            const needsProducts = service.products.length === 0;

            return (
              <li
                key={service.id}
                className={`flex flex-col rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6 ${
                  needsProducts ? "ring-2 ring-amber-300/80" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug">{service.name}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {service.products.length} product{service.products.length === 1 ? "" : "s"}
                      {needsProducts ? " · add at least one" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeService(service.id, service.name)}
                    disabled={pending}
                    className="shrink-0 cursor-pointer text-xs font-semibold text-muted hover:text-red-700 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-4 min-h-[2.5rem] flex-1">
                  {service.products.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {service.products.map((product) => (
                        <li
                          key={product.id}
                          className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-slate-200 bg-mist py-1 pl-2.5 pr-1 text-sm"
                        >
                          <span className="truncate">{product.name}</span>
                          <button
                            type="button"
                            onClick={() => removeProduct(service.id, product.id)}
                            disabled={pending}
                            className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-white hover:text-red-700"
                            aria-label={`Remove ${product.name}`}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted">No products on this service yet.</p>
                  )}
                </div>

                {!isAdding ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingToServiceId(service.id);
                      setError(null);
                    }}
                    disabled={pending}
                    className={`${needsProducts ? primaryButtonClass : quietButtonClass} mt-5 w-full`}
                  >
                    {needsProducts ? "Add products" : "Add more products"}
                  </button>
                ) : (
                  <div className="mt-5 rounded-2xl border-2 border-blue/20 bg-mist/60 p-4">
                    <p className="text-xs font-semibold text-muted">Queue products, then save</p>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={productNames[service.id] ?? ""}
                        onChange={(e) =>
                          setProductNames((prev) => ({ ...prev, [service.id]: e.target.value }))
                        }
                        onKeyDown={(e) => onProductKeyDown(e, service.id)}
                        placeholder={productPlaceholder(service.name)}
                        className={`${fieldClass} bg-white`}
                        disabled={pending}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => queueProduct(service.id)}
                        disabled={pending || !(productNames[service.id]?.trim())}
                        aria-label="Add to queue"
                        className="inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue text-2xl font-light text-white hover:bg-blue-deep disabled:opacity-60"
                      >
                        +
                      </button>
                    </div>
                    {draft.length > 0 ? (
                      <div className="mt-3">
                        <ul className="flex flex-wrap gap-2">
                          {draft.map((name, index) => (
                            <li
                              key={`${name}-${index}`}
                              className="inline-flex items-center gap-1 rounded-full bg-blue/15 py-1 pl-2.5 pr-1 text-sm font-medium"
                            >
                              {name}
                              <button
                                type="button"
                                onClick={() => removeDraftProduct(service.id, index)}
                                className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-blue/25"
                                aria-label={`Remove ${name}`}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => saveAllProducts(service.id)}
                            disabled={pending}
                            className={`${primaryButtonClass} flex-1`}
                          >
                            {pending
                              ? "Saving…"
                              : `Save ${draft.length} product${draft.length === 1 ? "" : "s"}`}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddingToServiceId(null);
                              setDraftProducts((prev) => ({ ...prev, [service.id]: [] }));
                            }}
                            disabled={pending}
                            className={quietButtonClass}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingToServiceId(null)}
                        className={`${quietButtonClass} mt-3 w-full`}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
