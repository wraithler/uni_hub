import Footer from "@/components/core/Footer.tsx";
import Header from "@/components/core/Header.tsx";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  landing?: boolean;
}

export default function Layout({ children, landing }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header landing={landing} />
      {children}
      <Footer />
    </div>
  );
}
