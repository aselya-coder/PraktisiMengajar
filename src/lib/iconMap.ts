import {
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Shield,
  Target,
  Users,
  Eye,
  GraduationCap,
  Mic2,
  BookOpen,
  Clock,
  Award,
  MessageSquare,
  Search,
  CalendarCheck,
  Presentation,
  Quote,
  Star,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  LucideIcon
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Shield,
  Target,
  Users,
  Eye,
  GraduationCap,
  Mic2,
  BookOpen,
  Clock,
  Award,
  MessageSquare,
  Search,
  CalendarCheck,
  Presentation,
  Quote,
  Star,
  Phone,
  Mail,
  MapPin,
  Menu,
  X
};

export const getIcon = (name: string) => {
  return iconMap[name] || Star; // Default to Star if not found
};
