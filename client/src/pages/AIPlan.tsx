import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type {
  TripPlanRequest,
  TripPlanResponse,
  TripPlanResponseRaw,
} from "@/types/tripPlan";
import { normalizeTripPlan } from "@/types/tripPlan";

const INTERESTS = [
  "Trekking",
  "Culture",
  "Food",
  "Adventure",
  "Spiritual",
  "Wildlife",
  "Photography",
];

export default function AIPlan() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    city: "",
    days: 3,
    interests: [] as string[],
  });
  const [tripPlan, setTripPlan] = useState<TripPlanResponse | null>(null);

  const planMutation = useMutation({
    mutationFn: async (data: TripPlanRequest) => {
      const res = await api.post<TripPlanResponseRaw>("/v1/ai/plan-trip", data);
      return normalizeTripPlan(res.data);
    },
    onSuccess: (data) => {
      setTripPlan(data);
      toast({
        title: "Trip Plan Generated!",
        description: "Your personalized itinerary is ready.",
      });
    },
    onError: (err) => {
      console.error("AI plan error:", err);
      toast({
        title: "Generation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city.trim()) {
      toast({
        title: "City required",
        description: "Please enter a destination city.",
        variant: "destructive",
      });
      return;
    }

    // Backend accepts empty interests, but if you want to require at least one, keep this:
    // if (formData.interests.length === 0) { ... }

    planMutation.mutate({
      city: formData.city.trim(),
      days: Number.isFinite(formData.days) ? formData.days : 3,
      interests: formData.interests.map((i) => i.toLowerCase()),
    });
  };

  const handleReset = () => {
    setTripPlan(null);
    setFormData({ city: "", days: 3, interests: [] });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 max-w-4xl">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Trip Planner</h1>
          <p className="text-muted-foreground">
            Get a personalized itinerary powered by AI
          </p>
        </div>

        {!tripPlan ? (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Plan Your Nepal Adventure</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="city">Destination City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      placeholder="e.g., Pokhara, Kathmandu"
                      className="pl-10"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="days">Number of Days</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="30"
                      className="pl-10"
                      value={formData.days}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          days: parseInt(e.target.value) || 3,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Your Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={
                          formData.interests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={planMutation.isPending}
                >
                  {planMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-scale-in">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">{tripPlan.title}</CardTitle>
              </CardHeader>
            </Card>

            {tripPlan.itinerary.length > 0 ? (
              tripPlan.itinerary.map((day) => (
                <Card key={day.day}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">
                        {day.day}
                      </span>
                      Day {day.day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {day.description}
                    </p>
                    {day.activities.length > 0 && (
                      <ul className="space-y-2">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6">
                  No items returned. Try another city.
                </CardContent>
              </Card>
            )}

            <Button onClick={handleReset} variant="outline" className="w-full">
              Plan Another Trip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
