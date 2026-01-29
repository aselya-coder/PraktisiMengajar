import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ContentProvider } from "@/context/ContentContext";
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ContentProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ContentProvider>
);
