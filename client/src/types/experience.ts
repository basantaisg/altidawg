export interface Experience {
  id: string;
  title: string;
  description: string;
  city: string;
  tags: string[];
  aiSummary?: string;
  price: number;
  duration: number;
  images: string[];
  operatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceSlot {
  id: string;
  experienceId: string;
  date: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
  bookedSlots: number;
}

export interface CreateExperienceData {
  title: string;
  description: string;
  city: string;
  tags: string[];
  price: number;
  duration: number;
  images: string[];
}
