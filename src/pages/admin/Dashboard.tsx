import { useContent } from "@/context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MessageSquareQuote, 
  Users, 
  FileText,
  ListOrdered,
  ExternalLink,
  Database
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import defaultDb from "@/data/db.json";
import { SiteContent } from "@/types/content";

const Dashboard = () => {
  const { data, loading, updateSection } = useContent();
  const [syncing, setSyncing] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Use data from context, or fall back to defaultDb directly if context data is empty/incomplete
  // Merge default data with context data to ensure all sections are present even if DB is partial
  const displayData = {
    ...defaultDb.content,
    ...(data || {})
  };

  const handleSyncDatabase = async () => {
    setSyncing(true);
    try {
      // Use displayData (which might be defaultDb) to sync to Supabase
      // If data is empty, we are essentially "seeding" the database with defaultDb
      const sourceData = displayData as unknown as SiteContent;
      const sections = Object.keys(sourceData);
      let successCount = 0;
      
      for (const sectionKey of sections) {
        const section = sectionKey as keyof SiteContent;
        // Skip if section data is not an object (sanity check)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (sourceData as any)[section] === 'object') {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           await updateSection(section, (sourceData as any)[section]);
           successCount++;
        }
      }
      
      toast.success(`Berhasil sinkronisasi ${successCount} section ke database!`);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Gagal sinkronisasi ke database.");
    } finally {
      setSyncing(false);
    }
  };

  const stats = [
    {
      title: "Services",
      value: (displayData.services?.items?.length || 0),
      icon: Briefcase,
      description: "Active services offered"
    },
    {
      title: "Testimonials",
      value: (displayData.testimonials?.items?.length || 0),
      icon: MessageSquareQuote,
      description: "Client testimonials"
    },
    {
      title: "Process Steps",
      value: (displayData.process?.steps?.length || 0),
      icon: ListOrdered,
      description: "Steps in how it works"
    },
    {
      title: "About Values",
      value: (displayData.about?.values?.length || 0),
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
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                onClick={handleSyncDatabase} 
                disabled={syncing}
            >
                <Database className="w-4 h-4 mr-2" />
                {syncing ? "Syncing..." : "Sync Database"}
            </Button>
            <Button asChild>
                <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Site
                </a>
            </Button>
        </div>
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
