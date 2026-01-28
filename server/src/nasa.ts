import type { NEOItem } from "./types";

type NasaFeedResponse = {
  near_earth_objects: Record<string, Array<any>>;
};

function toNumber(x: any): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchNeosForDate(params: {
  date: string;        // YYYY-MM-DD
  apiKey: string;
}): Promise<NEOItem[]> {
  const { date, apiKey } = params;

  const url =
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NASA API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as NasaFeedResponse;

  const listForDate = data.near_earth_objects?.[date] ?? [];

  // Flatten + normalize to what frontend needs
  const normalized: NEOItem[] = listForDate.map((neo: any) => {
    const meters = neo?.estimated_diameter?.meters;
    const sizeAvg =
      (toNumber(meters?.estimated_diameter_min) + toNumber(meters?.estimated_diameter_max)) / 2;

    // Pick the first close approach entry (for feed date, it usually matches)
    const ca = Array.isArray(neo?.close_approach_data) ? neo.close_approach_data[0] : undefined;

    const missDistanceKm = toNumber(ca?.miss_distance?.kilometers);
    const relativeVelocityKps =
      toNumber(ca?.relative_velocity?.kilometers_per_second);

    return {
      id: String(neo?.id ?? ""),
      name: String(neo?.name ?? "Unknown"),
      sizeMeters: sizeAvg,
      missDistanceKm,
      relativeVelocityKps,
      nasaJplUrl: neo?.nasa_jpl_url ? String(neo.nasa_jpl_url) : undefined
    };
  });

  return normalized;
}
