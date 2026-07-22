"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || "";
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (isLoginRoute) return <>{children}</>;
  return <GuardedShell>{children}</GuardedShell>;
};

/**
 * Split out so the guard's hooks never run on the public login route.
 */
const GuardedShell = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { checked, isAuthenticated } = useAdminAuth();

  if (!checked)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-gray-500">Redirecting to sign in...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white">
      {/* desktop sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">
        <AdminSidebar />
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg border border-gray-200 p-2"
          >
            <Menu size={18} />
          </button>
          <span className="font-semibold">Dashboard</span>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
