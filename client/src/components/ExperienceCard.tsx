import { Link } from 'react-router-dom';
import { MapPin, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Experience } from '@/types/experience';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link to={`/experience/${experience.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={experience.images?.[0] || '/placeholder.svg'}
            alt={experience.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {experience.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {experience.city}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {experience.duration}h
            </div>
          </div>

          {experience.aiSummary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {experience.aiSummary}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {experience.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">From</span>
            <p className="text-xl font-bold text-primary">
              NPR {experience.price}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
