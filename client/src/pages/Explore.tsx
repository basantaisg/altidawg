import { useState } from 'react';
import { useExperiences } from '@/hooks/useExperiences';
import { ExperienceCard } from '@/components/ExperienceCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

const CITIES = ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Bhaktapur'];
const TAGS = ['Trekking', 'Culture', 'Food', 'Adventure', 'Spiritual', 'Wildlife'];

export default function Explore() {
  const [city, setCity] = useState<string>();
  const [tag, setTag] = useState<string>();
  
  const { data: experiences, isLoading } = useExperiences({ city, tag });

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Explore Experiences</h1>
          <p className="text-muted-foreground">
            Discover authentic adventures across Nepal
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 animate-slide-up">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {TAGS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(city || tag) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCity(undefined);
                setTag(undefined);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner />
        ) : experiences && experiences.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No experiences found"
            description="Try adjusting your filters or check back later for new experiences."
          />
        )}
      </div>
    </div>
  );
}
