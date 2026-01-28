import { z } from "zod";

export const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  sort: z.enum(["size", "distance", "velocity"]).optional().default("distance"),
  order: z.enum(["asc", "desc"]).optional().default("asc")
});

export type QueryInput = z.infer<typeof QuerySchema>;

export const NEOItemSchema = {
  type: "object",
  required: ["id", "name", "sizeMeters", "missDistanceKm", "relativeVelocityKps"],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    sizeMeters: { type: "number" },
    missDistanceKm: { type: "number" },
    relativeVelocityKps: { type: "number" },
    nasaJplUrl: { type: "string" }
  }
} as const;
