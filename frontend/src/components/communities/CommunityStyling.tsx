import { BookOpen, Globe, GraduationCap, Music } from "lucide-react";
import { JSX } from "react";

type CategoryConfig = {
  bannerGradient: string;
  avatarBg: string;
  icon: JSX.Element;
  featuredIcon: JSX.Element;
  badgeIcon: JSX.Element;
};

const categoryConfig: Record<string, CategoryConfig> = {
  Academic: {
    bannerGradient: "from-blue-500 to-indigo-600",
    avatarBg: "bg-blue-600",
    icon: <BookOpen className="w-16 h-16 text-white" />,
    featuredIcon: <BookOpen className="w-16 h-16 text-white opacity-20" />,
    badgeIcon: <GraduationCap className="w-4 h-4" />,
  },
  Cultural: {
    bannerGradient: "from-green-500 to-emerald-600",
    avatarBg: "bg-green-600",
    icon: <Globe className="w-16 h-16 text-white" />,
    featuredIcon: <Globe className="w-16 h-16 text-white opacity-20" />,
    badgeIcon: <Globe className="w-4 h-4" />,
  },
  Interest: {
    bannerGradient: "from-purple-500 to-violet-600",
    avatarBg: "bg-purple-600",
    icon: <Music className="w-16 h-16 text-white" />,
    featuredIcon: <Music className="w-16 h-16 text-white opacity-20" />,
    badgeIcon: <Music className="w-4 h-4" />,
  },
};

export default categoryConfig;
