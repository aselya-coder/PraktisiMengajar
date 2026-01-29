import axios from "axios";

// Default to localhost:3001 if not specified
const API_URL = "http://localhost:3001";

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

export const saveContent = async (section: string, data: any) => {
  try {
    // Patch the specific key within the content object
    const response = await api.patch("/content", { [section]: data });
    return response.data;
  } catch (error) {
    console.error("Error saving content:", error);
    throw error;
  }
};
