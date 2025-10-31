import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Experience } from '@/types/experience';
import type { CreateBookingData } from '@/types/booking';

interface BookingModalProps {
  experience: Experience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ experience, open, onOpenChange }: BookingModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfPeople: 1,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: CreateBookingData) => {
      const response = await api.post('/v1/public/bookings', data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Booking Successful!',
        description: 'Your booking has been confirmed. Check your email for details.',
      });
      onOpenChange(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        numberOfPeople: 1,
      });
    },
    onError: () => {
      toast({
        title: 'Booking Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate({
      experienceId: experience.id,
      slotId: 'temp-slot-id', // In production, user would select from available slots
      ...formData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {experience.title}</DialogTitle>
          <DialogDescription>
            Fill in your details to complete the booking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="people">Number of People</Label>
            <Input
              id="people"
              type="number"
              min="1"
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span>Price per person:</span>
              <span className="font-medium">NPR {experience.price}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Number of people:</span>
              <span className="font-medium">{formData.numberOfPeople}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
              <span>Total:</span>
              <span className="text-primary">NPR {experience.price * formData.numberOfPeople}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={bookingMutation.isPending}>
            {bookingMutation.isPending ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
