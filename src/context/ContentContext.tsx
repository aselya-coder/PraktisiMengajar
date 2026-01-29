import React, { createContext, useContext, useEffect, useState } from "react";
import { getContent, saveContent } from "@/services/api";
import { toast } from "sonner";

interface ContentContextType {
  data: any;
  loading: boolean;
  updateSection: (section: string, newData: any) => Promise<void>;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const content = await getContent();
      setData(content);
    } catch (error) {
      console.error("Failed to load content", error);
      // Fallback to local import if API fails
      try {
        const localData = await import("../data/db.json");
        // Check if localData has .content (new structure) or is the content itself
        setData(localData.default.content || localData.default);
      } catch (e) {
        console.error("Critical error loading content fallback", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSection = async (section: string, newData: any) => {
    try {
      // Optimistic update
      setData((prev: any) => ({
        ...prev,
        [section]: newData
      }));

      await saveContent(section, newData);
      toast.success(`${section} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${section}`);
      // Revert or fetch again
      fetchData();
    }
  };

  return (
    <ContentContext.Provider value={{ data, loading, updateSection, refresh: fetchData }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
