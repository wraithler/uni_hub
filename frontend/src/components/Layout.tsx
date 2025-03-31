import Footer from "@/components/Footer.tsx";
import Header from "@/components/Header.tsx";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
    landing?: boolean;
}

export default function Layout({ children, landing }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header landing={landing}/>
      {children}
      <Footer />
    </div>
  );
}
