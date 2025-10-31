import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExperience } from '@/hooks/useExperience';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Tag, Calendar } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: experience, isLoading } = useExperience(id!);
  const [showBooking, setShowBooking] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!experience) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold">Experience not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Image */}
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={experience.images?.[0] || '/placeholder.svg'}
                alt={experience.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title and Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {experience.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {experience.city}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {experience.duration} hours
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {experience.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            {experience.aiSummary && (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-accent">✨</div>
                    <div>
                      <h3 className="font-semibold mb-2">AI Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        {experience.aiSummary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">About This Experience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 animate-slide-up">
              <CardContent className="p-6">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground">From</span>
                  <p className="text-3xl font-bold text-primary">
                    NPR {experience.price}
                  </p>
                  <span className="text-sm text-muted-foreground">per person</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={() => setShowBooking(true)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{experience.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{experience.city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingModal
        experience={experience}
        open={showBooking}
        onOpenChange={setShowBooking}
      />
    </div>
  );
}
