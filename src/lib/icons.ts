import {
  Code2,
  Cloud,
  ShieldCheck,
  Palette,
  TrendingUp,
  GraduationCap,
  Briefcase,
  ShoppingCart,
  Plug,
  BarChart3,
  Headphones,
  Bot,
  type LucideIcon,
} from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  code: Code2,
  cloud: Cloud,
  "shield-lock": ShieldCheck,
  palette: Palette,
  "chart-arrows": TrendingUp,
  school: GraduationCap,
  briefcase: Briefcase,
  "shopping-cart": ShoppingCart,
  "plug-connected": Plug,
  "chart-bar": BarChart3,
  headset: Headphones,
  robot: Bot,
};

export function getServiceIcon(icon: string): LucideIcon {
  return serviceIcons[icon] ?? Code2;
}
