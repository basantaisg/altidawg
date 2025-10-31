import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Operator() {
  const { toast } = useToast();
  const [operatorKey, setOperatorKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('operatorKey');
    if (storedKey) {
      setOperatorKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!operatorKey.trim()) {
      toast({
        title: 'Invalid Key',
        description: 'Please enter your operator key.',
        variant: 'destructive',
      });
      return;
    }
    localStorage.setItem('operatorKey', operatorKey);
    setIsAuthenticated(true);
    toast({
      title: 'Key Saved',
      description: 'Your operator key has been saved.',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('operatorKey');
    setOperatorKey('');
    setIsAuthenticated(false);
    toast({
      title: 'Logged Out',
      description: 'Your operator key has been removed.',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Operator Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="operatorKey">Operator Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="operatorKey"
                    type="password"
                    placeholder="Enter your operator key"
                    className="pl-10"
                    value={operatorKey}
                    onChange={(e) => setOperatorKey(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleSaveKey} className="w-full">
                Save Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">Operator Dashboard</h1>
            <p className="text-muted-foreground">Manage your experiences and bookings</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="experiences" className="animate-slide-up">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="experiences" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience creation form would go here. Connect to POST /v1/operator/experiences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  List of operator's experiences would go here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Booking management interface would go here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics charts and metrics would go here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
