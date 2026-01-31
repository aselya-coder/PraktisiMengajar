import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import HeroEditor from "./HeroEditor";
import ServicesEditor from "./ServicesEditor";
import ProcessEditor from "./ProcessEditor";
import TestimonialsEditor from "./TestimonialsEditor";
import AboutEditor from "./AboutEditor";
import CTAEditor from "./CTAEditor";
import Login from "./Login";

const AdminIndex = () => {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="login" element={<Login />} />

      {/* DASHBOARD */}
      <Route index element={<Dashboard />} />

      {/* CONTENT MANAGEMENT */}
      <Route path="hero" element={<HeroEditor />} />
      <Route path="services" element={<ServicesEditor />} />
      <Route path="process" element={<ProcessEditor />} />
      <Route path="testimonials" element={<TestimonialsEditor />} />
      <Route path="about" element={<AboutEditor />} />
      <Route path="cta" element={<CTAEditor />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminIndex;
