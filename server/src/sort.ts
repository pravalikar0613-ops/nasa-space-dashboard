import type { NEOItem, SortField, SortOrder } from "./types";

export function sortNeos(items: NEOItem[], field: SortField, order: SortOrder): NEOItem[] {
  const dir = order === "asc" ? 1 : -1;

  const getValue = (x: NEOItem) => {
    if (field === "size") return x.sizeMeters;
    if (field === "distance") return x.missDistanceKm;
    return x.relativeVelocityKps;
  };

  return [...items].sort((a, b) => (getValue(a) - getValue(b)) * dir);
}
