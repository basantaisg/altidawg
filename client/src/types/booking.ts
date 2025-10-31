export interface Booking {
  id: string;
  experienceId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  experienceId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
}
