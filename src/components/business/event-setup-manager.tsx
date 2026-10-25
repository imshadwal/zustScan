"use client";

import { useState } from "react";
import { fieldClass, primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import { useToast } from "@/components/toast/toast-provider";
import type { EventAreaRecord } from "@/lib/business-events";

export function EventSetupManager({
  initialEventName,
  initialEventDate,
  initialAreas,
}: {
  initialEventName: string;
  initialEventDate: string | null;
  initialAreas: EventAreaRecord[];
}) {
  const { success, error: toastError } = useToast();
  const [eventName, setEventName] = useState(initialEventName);
  const [eventDate, setEventDate] = useState(initialEventDate ?? "");
  const [areas, setAreas] = useState(initialAreas);
  const [newArea, setNewArea] = useState("");
  const [pending, setPending] = useState(false);

  async function saveEvent() {
    setPending(true);
    try {
      const response = await fetch("/api/business/event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName, eventDate }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        toastError(body?.error ?? "Could not save event.");
        setPending(false);
        return;
      }
      success("Event details saved.");
      setPending(false);
    } catch {
      toastError("The request could not be sent.");
      setPending(false);
    }
  }

  async function addArea() {
    const name = newArea.trim();
    if (!name) return;
    setPending(true);
    try {
      const response = await fetch("/api/business/event/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const body = (await response.json().catch(() => null)) as
        | { area?: EventAreaRecord; error?: string }
        | null;
      if (!response.ok || !body?.area) {
        toastError(body?.error ?? "Could not add area.");
        setPending(false);
        return;
      }
      setAreas((prev) => [...prev, body.area!]);
      setNewArea("");
      success("Area added.");
      setPending(false);
    } catch {
      toastError("The request could not be sent.");
      setPending(false);
    }
  }

  async function removeArea(areaId: string) {
    setPending(true);
    await fetch(`/api/business/event/areas/${areaId}`, { method: "DELETE" });
    setAreas((prev) => prev.filter((a) => a.id !== areaId));
    success("Area removed.");
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
        <h2 className="text-sm font-semibold text-muted">Event details</h2>
        <p className="mt-1 text-sm text-muted">
          For the next function, edit the name and date here. Your venue name stays under Profile.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="event-name">
              Event name
            </label>
            <input
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Sharma–Gupta wedding reception"
              className={`${fieldClass} mt-2`}
              disabled={pending}
            />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="event-date">
              Event date
            </label>
            <input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={`${fieldClass} mt-2`}
              disabled={pending}
            />
          </div>
          <button
            type="button"
            onClick={() => void saveEvent()}
            disabled={pending}
            className={primaryButtonClass}
          >
            Save event
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
        <h2 className="text-sm font-semibold text-muted">Guest areas</h2>
        <p className="mt-1 text-sm text-muted">
          Add what guests can tap on the standee QR (e.g. Food, Hall, Décor). Start empty — nothing
          is pre-filled.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {areas.map((area) => (
            <li
              key={area.id}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-mist py-1 pl-3 pr-1 text-sm"
            >
              {area.name}
              <button
                type="button"
                disabled={pending}
                onClick={() => void removeArea(area.id)}
                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-white hover:text-red-700 disabled:opacity-40"
                aria-label={`Remove ${area.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void addArea();
              }
            }}
            placeholder="Décor"
            className={fieldClass}
            disabled={pending}
          />
          <button
            type="button"
            onClick={() => void addArea()}
            disabled={pending || !newArea.trim()}
            className={`${quietButtonClass} shrink-0 sm:px-6`}
          >
            Add area
          </button>
        </div>
      </section>
    </div>
  );
}
