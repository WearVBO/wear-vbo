"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DesktopNav from "@/components/containers/Navbar/DesktopNav";
import MobileNav from "@/components/containers/Navbar/MobileNav";
import Footer from "@/components/containers/Footer/Footer";
import AOSInit from "@/components/containers/AOSInit";
import GuestSessionInit from "@/components/containers/GuestSessionInit";

/**
 * Storefront chrome. Admin routes render their own dashboard shell, so the
 * nav, footer and guest-session bootstrap are skipped there.
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <GuestSessionInit />
      <div className="hidden md:block">
        <DesktopNav />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <AOSInit />
      <div className="max-w-[1440px] mx-auto">
        {children}
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
