import { useEffect, useMemo, useState } from "react";
import "./App.css";

type SortField = "size" | "distance" | "velocity";
type SortOrder = "asc" | "desc";

type NEOItem = {
  id: string;
  name: string;
  sizeMeters: number;
  missDistanceKm: number;
  relativeVelocityKps: number;
  nasaJplUrl?: string;
};

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function App() {
  const [date, setDate] = useState<string>(todayISO());
  const [sort, setSort] = useState<SortField>("distance");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [items, setItems] = useState<NEOItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const apiUrl = useMemo(() => {
    const qs = new URLSearchParams({ date, sort, order });
    return `/api/neos?${qs.toString()}`;
  }, [date, sort, order]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  function toggleSort(field: SortField) {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h2>NASA Near-Earth Objects</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Date:&nbsp;
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>

        <span style={{ opacity: 0.8 }}>
          Sort: <b>{sort}</b> ({order})
        </span>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Name</th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("size")}>
                Size (m) {sort === "size" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("distance")}>
                Distance (km) {sort === "distance" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("velocity")}>
                Velocity (km/s) {sort === "velocity" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((x) => (
              <tr key={x.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "10px 6px" }}>
                  {x.nasaJplUrl ? (
                    <a href={x.nasaJplUrl} target="_blank" rel="noreferrer">
                      {x.name}
                    </a>
                  ) : (
                    x.name
                  )}
                </td>
                <td style={{ padding: "10px 6px" }}>{x.sizeMeters.toFixed(2)}</td>
                <td style={{ padding: "10px 6px" }}>{x.missDistanceKm.toFixed(0)}</td>
                <td style={{ padding: "10px 6px" }}>{x.relativeVelocityKps.toFixed(3)}</td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 12, opacity: 0.7 }}>
                  No results for this date (or API limit hit).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
