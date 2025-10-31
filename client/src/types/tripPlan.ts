export interface TripPlanRequest {
  city: string;
  days: number;
  interests: string[];
}

export interface TripPlanResponse {
  title: string;
  itinerary: {
    day: number;
    activities: string[];
    description: string;
  }[];
}
