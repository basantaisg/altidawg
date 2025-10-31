import { Link, useLocation } from 'react-router-dom';
import { Mountain, Sparkles, Map, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NepTrip
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/explore">
            <Button
              variant={isActive('/explore') ? 'default' : 'ghost'}
              size="sm"
            >
              <Map className="mr-2 h-4 w-4" />
              Explore
            </Button>
          </Link>
          <Link to="/ai-plan">
            <Button
              variant={isActive('/ai-plan') ? 'default' : 'ghost'}
              size="sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Planner
            </Button>
          </Link>
          <Link to="/operator">
            <Button
              variant={isActive('/operator') ? 'secondary' : 'ghost'}
              size="sm"
            >
              <User className="mr-2 h-4 w-4" />
              Operator
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
