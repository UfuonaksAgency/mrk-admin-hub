import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Settings, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">MrK Trading Agency</h1>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Welcome to MrK Trading Agency
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive trading education and mentorship platform. 
              Learn from experts, access premium resources, and take your trading to the next level.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Trading Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access comprehensive trading guides, video tutorials, and educational content.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Free Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Download free trading tools, spreadsheets, and guides to improve your trading.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Consultation & Mentorship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get personalized guidance through one-on-one consultations and mentorship programs.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Start Learning
            </Button>
            <Button size="lg" variant="outline">
              Book Consultation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
