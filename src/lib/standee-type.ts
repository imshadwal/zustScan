export type StandeeType = "table" | "event";

export function normalizeStandeeType(value: unknown): StandeeType {
  return value === "event" ? "event" : "table";
}

export function isStandeeType(value: unknown): value is StandeeType {
  return value === "table" || value === "event";
}

export const DEFAULT_EVENT_AREAS = ["Food", "Hall", "Staff", "Ambience"] as const;
