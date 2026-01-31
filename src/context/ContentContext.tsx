import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import defaultData from "@/data/db.json";
import { SiteContent } from "@/types/content";

interface ContentContextType {
  data: SiteContent | null;
  loading: boolean;
  updateSection: <K extends keyof SiteContent>(section: K, newData: SiteContent[K]) => Promise<void>;
  refresh: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback to local storage or db.json if database is empty or connection fails
  const loadFallbackData = (): SiteContent => {
    try {
      // First try local storage
      const storedData = localStorage.getItem("siteContent");
      if (storedData) {
        return JSON.parse(storedData);
      }
      // Then default data
      return (defaultData.content || defaultData) as unknown as SiteContent;
    } catch (e) {
      console.error("Error loading fallback data", e);
      return (defaultData.content || defaultData) as unknown as SiteContent;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all sections from Supabase
      const { data: sections, error } = await supabase
        .from("sections")
        .select("*");

      if (error) {
        throw error;
      }

      if (sections && sections.length > 0) {
        // Transform array [{key: 'hero', data: {...}}, ...] to object {hero: {...}, ...}
        const contentObject: Partial<SiteContent> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sections.forEach((row: { key: keyof SiteContent; data: any }) => {
          contentObject[row.key] = row.data;
        });       
        setData(contentObject as SiteContent);
        // Also update local storage for offline support/faster subsequent loads
        localStorage.setItem("siteContent", JSON.stringify(contentObject));
      } else {
        // No data in DB, use fallback (Expected for fresh install)
        console.info("Info: Supabase is empty. Loading default content from local file.");
        const fallback = loadFallbackData();
        setData(fallback);
      }
    } catch (error) {
      console.warn("Notice: Using local content backup (Supabase connection issue or empty).");
      // Fallback on error (e.g., missing env vars or network error)
      const fallback = loadFallbackData();
      setData(fallback);
      
      // Silent fail is better for UX if fallback works
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSection = async <K extends keyof SiteContent>(section: K, newData: SiteContent[K]) => {
    try {
      // 1. Optimistic Update (Update UI immediately)
      setData((prev) => {
        if (!prev) return prev;
        const updatedContent = {
          ...prev,
          [section]: newData
        };
        return updatedContent;
      });

      // 2. Update Supabase
      const { error } = await supabase
        .from("sections")
        .upsert({ key: section, data: newData }, { onConflict: "key" });

      if (error) throw error;

      // 3. Update Local Storage Backup
      const currentData = loadFallbackData();
      const updatedLocal = { ...currentData, [section]: newData };
      localStorage.setItem("siteContent", JSON.stringify(updatedLocal));

      toast.success(`${section} updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${section}`, error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save to database: ${message}`);
      
      // Revert state if needed (optional, but good practice)
      fetchData(); 
    }
  };

  return (
    <ContentContext.Provider value={{ data, loading, updateSection, refresh: fetchData }}>
      {children}
    </ContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
