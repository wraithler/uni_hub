// import { JSX } from "react";
// import { Code, PenTool, User } from "lucide-react"; 

type ProfileStyleConfig = {
  bannerGradient: string;
  avatarBg: string;
};

const profileConfig: Record<string, ProfileStyleConfig> = {
  Developer: {
    bannerGradient: "from-blue-500 to-indigo-600",
    avatarBg: "bg-sky-600",

  },
  Designer: {
    bannerGradient: "from-blue-500 to-indigo-600",
    avatarBg: "bg-pink-600",
  },
  Default: {
    bannerGradient: "from-blue-500 to-indigo-600",
    avatarBg: "bg-blue-600",

  },
};

export default profileConfig;