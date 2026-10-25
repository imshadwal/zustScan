export const OTHERS_CATEGORY_ID = "others";

export type BusinessCategoryOption = {
  id: string;
  label: string;
  sortOrder: number;
  isOthers: boolean;
};

/** Used when the options table is missing or empty (dev / before SQL). */
export const FALLBACK_CATEGORY_OPTIONS: BusinessCategoryOption[] = [
  { id: "hotel", label: "Hotels", sortOrder: 0, isOthers: false },
  { id: "cafe", label: "Cafe", sortOrder: 1, isOthers: false },
  { id: "digital-marketing", label: "Digital Marketing", sortOrder: 2, isOthers: false },
  { id: "hospitality", label: "Hospitality", sortOrder: 3, isOthers: false },
  { id: "restaurant", label: "Restaurant", sortOrder: 4, isOthers: false },
  { id: "retail", label: "Retail", sortOrder: 5, isOthers: false },
  { id: "salon-spa", label: "Salon & Spa", sortOrder: 6, isOthers: false },
  { id: "healthcare", label: "Healthcare", sortOrder: 7, isOthers: false },
  { id: "education", label: "Education", sortOrder: 8, isOthers: false },
  { id: "real-estate", label: "Real Estate", sortOrder: 9, isOthers: false },
  { id: OTHERS_CATEGORY_ID, label: "Others", sortOrder: 99, isOthers: true },
];

export function slugFromCategoryLabel(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function isValidCategorySlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 2 && value.length <= 40;
}

export function isBusinessCategoryId(value: string, options: BusinessCategoryOption[]) {
  return options.some((item) => item.id === value);
}

export function findCategoryOption(
  id: string | null | undefined,
  options: BusinessCategoryOption[],
) {
  if (!id) return undefined;
  return options.find((item) => item.id === id);
}

export function categoryLabel(
  id: string,
  options: BusinessCategoryOption[],
  otherLabel?: string | null,
) {
  const option = findCategoryOption(id, options);
  if (id === OTHERS_CATEGORY_ID || option?.isOthers) {
    const custom = otherLabel?.trim();
    return custom || option?.label || "Other business";
  }
  return option?.label ?? id;
}

export function normalizeCategoryOther(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidCategoryOther(value: string) {
  const text = normalizeCategoryOther(value);
  return text.length >= 2 && text.length <= 80;
}
