import { Button } from "@/components/ui/button.tsx";
import { Calendar, Home, MessageSquare, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider.tsx";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/core/AdminHeader.tsx";
import UserDropdownMenu from "@/components/users/UserDropDownMenu.tsx";

interface HeaderProps {
  landing?: boolean;
}

const tabs = {
  landing: [
    {
      name: "Features",
      href: "#features",
      icon: "",
    },
    {
      name: "Communities",
      href: "#communities",
      icon: "",
    },
    {
      name: "Testimonials",
      href: "#testimonials",
      icon: "",
    },
    {
      name: "FAQ",
      href: "#faq",
      icon: "",
    },
  ],
  application: [
    {
      name: "Home",
      href: "/feed",
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: "Communities",
      href: "/communities",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Events",
      href: "/events",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      name: "Support",
      href: "/support",
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ],
};

export default function Header({ landing }: HeaderProps) {
  const headerTabs = landing ? tabs.landing : tabs.application;
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Header */}
      {user?.is_superuser && <AdminHeader />}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              U
            </div>
            <span className="text-xl font-bold">Uni Hub</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {headerTabs.map((tab, index) => (
              <Button variant="ghost" asChild key={index}>
                <Link to={tab.href}>
                  {tab.icon}
                  <span>{tab.name}</span>
                </Link>
              </Button>
            ))}
          </nav>

          {user ? (
            <UserDropdownMenu />
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b">
        {headerTabs.map((tab, index) => (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            asChild
            key={index}
          >
            <Link to={tab.href}>
              {tab.icon}
              <span>{tab.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </>
  );
}
