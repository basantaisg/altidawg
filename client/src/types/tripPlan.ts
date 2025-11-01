// types/tripPlan.ts
export type TripPlanRequest = {
  city: string;
  days: number;
  interests?: string[];
};

// Raw shape from API can be strings or objects
export type TripPlanResponseRaw = {
  title?: string;
  itinerary?:
    | string[]
    | Array<{
        day?: number;
        description?: string;
        activities?: string[];
      }>;
};

// Final shape your UI will render
export type TripPlanResponse = {
  title: string;
  itinerary: Array<{
    day: number;
    description: string;
    activities: string[];
  }>;
};

// Normalizer: converts any raw response into the UI-friendly shape
export function normalizeTripPlan(raw: TripPlanResponseRaw): TripPlanResponse {
  const title =
    typeof raw?.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : "Your Trip Plan";

  const it = raw?.itinerary;

  // Case A: itinerary is already objects
  if (Array.isArray(it) && typeof it[0] === "object") {
    const arr = (it as Array<any>).map((d: any, idx: number) => ({
      day: Number.isFinite(d?.day) ? d.day : idx + 1,
      description:
        typeof d?.description === "string" && d.description.trim()
          ? d.description.trim()
          : `Activities planned for Day ${idx + 1}.`,
      activities: Array.isArray(d?.activities) ? d.activities.map(String) : [],
    }));
    return { title, itinerary: arr };
  }

  // Case B: itinerary is array of strings
  if (Array.isArray(it)) {
    const arr = (it as string[]).map((line, idx) => ({
      day: idx + 1,
      description: String(line ?? "").trim(),
      activities: [],
    }));
    return { title, itinerary: arr };
  }

  // Fallback: empty
  return {
    title,
    itinerary: [],
  };
}
