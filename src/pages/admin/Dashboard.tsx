import { useContent } from "@/context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MessageSquareQuote, 
  Users, 
  FileText,
  ListOrdered,
  ExternalLink
} from "lucide-react";

const Dashboard = () => {
  const { data, loading } = useContent();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) return <div>No data available</div>;

  const stats = [
    {
      title: "Services",
      value: data.services?.items?.length || 0,
      icon: Briefcase,
      description: "Active services offered"
    },
    {
      title: "Testimonials",
      value: data.testimonials?.items?.length || 0,
      icon: MessageSquareQuote,
      description: "Client testimonials"
    },
    {
      title: "Process Steps",
      value: data.process?.steps?.length || 0,
      icon: ListOrdered,
      description: "Steps in how it works"
    },
    {
      title: "About Values",
      value: data.about?.values?.length || 0,
      icon: Users, // Using Users as a placeholder for values/culture
      description: "Core values listed"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
            Welcome to the admin dashboard. Here is an overview of your website content.
            </p>
        </div>
        <Button asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Site
            </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity or Quick Links could go here */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">System Operational</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
                Connected to data source. Changes will be reflected immediately on the live site.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
