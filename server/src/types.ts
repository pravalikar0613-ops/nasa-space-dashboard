export type SortField = "size" | "distance" | "velocity";
export type SortOrder = "asc" | "desc";

export type NEOItem = {
  id: string;
  name: string;
  sizeMeters: number; 
  missDistanceKm: number;      
  relativeVelocityKps: number;     
  nasaJplUrl?: string;
};
