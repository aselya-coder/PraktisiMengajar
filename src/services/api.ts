import axios from "axios";

// Default to environment variable or relative path
const API_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: API_URL,
});

export const getContent = async () => {
  try {
    const response = await api.get("/content");
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    // Fallback to local import if API fails (for production build without json-server)
    const localData = await import("../data/db.json");
    return localData.default.content;
  }
};

export const saveContent = async <T>(section: string, data: T) => {
  try {
    // Patch the specific key within the content object
    const response = await api.patch("/content", { [section]: data });
    return response.data;
  } catch (error) {
    console.error("Error saving content:", error);
    throw error;
  }
};
