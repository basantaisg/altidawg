// Shared types for AI responses

export interface TripDay {
  day: number;
  description: string;
  activities: string[];
}

export interface TripPlan {
  title: string;
  itinerary: TripDay[];
}

export interface EnrichResult {
  tags: string[];
  summary: string;
}
