import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Map, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-nepal.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 mountain-overlay" />
        </div>
        
        <div className="relative z-10 container text-center text-white px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Discover Authentic Nepal 🌄
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Powered by locals and AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" className="text-lg">
                <Map className="mr-2 h-5 w-5" />
                Explore Experiences
              </Button>
            </Link>
            <Link to="/ai-plan">
              <Button size="lg" variant="secondary" className="text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Plan with AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-slide-up">
            Why Choose NepTrip?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Operators</h3>
              <p className="text-muted-foreground">
                Connect directly with authentic local guides and operators
              </p>
            </div>

            <div className="text-center p-6 rounded-lg animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Planning</h3>
              <p className="text-muted-foreground">
                Get personalized itineraries crafted by AI for your perfect trip
              </p>
            </div>

            <div className="text-center p-6 rounded-lg animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book experiences instantly with real-time availability
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
