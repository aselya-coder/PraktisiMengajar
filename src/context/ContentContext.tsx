import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import defaultData from "@/data/db.json";

interface ContentContextType {
  data: any;
  loading: boolean;
  updateSection: (section: string, newData: any) => Promise<void>;
  refresh: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback to local storage or db.json if database is empty or connection fails
  const loadFallbackData = () => {
    try {
      // First try local storage
      const storedData = localStorage.getItem("siteContent");
      if (storedData) {
        return JSON.parse(storedData);
      }
      // Then default data
      return defaultData.content || defaultData;
    } catch (e) {
      console.error("Error loading fallback data", e);
      return defaultData.content || defaultData;
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
        const contentObject: Record<string, any> = {};
        sections.forEach((row: any) => {
          contentObject[row.key] = row.data;
        });
        
        setData(contentObject);
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
  }, []);

  const updateSection = async (section: string, newData: any) => {
    try {
      // 1. Optimistic Update (Update UI immediately)
      setData((prev: any) => {
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
    } catch (error: any) {
      console.error(`Failed to update ${section}`, error);
      toast.error(`Failed to save to database: ${error.message}`);
      
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

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
