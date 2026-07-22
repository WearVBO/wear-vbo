"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronsUpDown,
  Home,
  List,
  LogOut,
  Package,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface NavChild {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  children?: NavChild[];
}

const NAV: NavItem[] = [
  { name: "Home", path: "/admin", icon: Home },
  {
    name: "Catalog",
    path: "/admin/products",
    icon: List,
    children: [
      { name: "Products", path: "/admin/products" },
      { name: "Orders", path: "/admin/orders" },
    ],
  },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Transactions", path: "/admin/transactions", icon: Receipt },
  { name: "Admins", path: "/admin/management", icon: ShieldCheck },
];

const isPathActive = (pathname: string, path: string) =>
  path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

const AdminSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname() || "";
  const [openGroup, setOpenGroup] = useState<string | null>("Catalog");
  const { admin, logout } = useAdminAuth();

  return (
    <aside className="flex h-full w-[280px] flex-col gap-6 border-r border-gray-200 bg-[#FAFAFA] px-4 py-6">
      {/* logo */}
      <div className="flex items-center justify-between px-2">
        <Link href="/admin" onClick={onNavigate}>
          <Image
            src="/Image/new-black.png"
            alt="WearVbo"
            width={80}
            height={50}
            className="w-[70px]"
          />
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            aria-label="Close menu"
            className="lg:hidden rounded-full p-1.5 hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* store switcher */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3">
        <span className="flex items-center gap-2.5 text-sm font-medium">
          <ShoppingBag size={18} className="text-gray-500" />
          WearVbo
        </span>
        <ChevronsUpDown size={16} className="text-gray-400" />
      </div>

      {/* search */}
      <Link
        href="/admin/products"
        onClick={onNavigate}
        className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <Search size={16} />
          Search
        </span>
        <kbd className="rounded-md border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </Link>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          Menu
        </p>
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isPathActive(pathname, item.path);

            if (!item.children) {
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-white font-semibold shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <Icon size={18} className={active ? "" : "text-gray-500"} />
                    {item.name}
                  </Link>
                </li>
              );
            }

            const groupOpen = openGroup === item.name;
            const groupActive = item.children.some((child) =>
              isPathActive(pathname, child.path),
            );

            return (
              <li
                key={item.name}
                className={cn(
                  "rounded-xl",
                  groupActive && "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
                )}
              >
                <button
                  onClick={() => setOpenGroup(groupOpen ? null : item.name)}
                  aria-expanded={groupOpen}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-3 font-medium">
                    <Icon size={18} className="text-gray-600" />
                    {item.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-gray-400 transition-transform",
                      groupOpen && "rotate-180",
                    )}
                  />
                </button>

                {groupOpen && (
                  <ul className="pb-2">
                    {item.children.map((child) => {
                      const childActive = isPathActive(pathname, child.path);
                      return (
                        <li key={child.path}>
                          <Link
                            href={child.path}
                            onClick={onNavigate}
                            className={cn(
                              "mx-2 flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors",
                              childActive
                                ? "bg-gray-100 font-semibold text-black"
                                : "text-gray-500 hover:text-black",
                            )}
                          >
                            {childActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                            )}
                            <span className={childActive ? "" : "pl-[18px]"}>
                              {child.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <p className="px-2 pb-2 pt-6 text-xs font-medium uppercase tracking-wider text-gray-400">
          Storefront
        </p>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Package size={18} className="text-gray-500" />
          View store
        </Link>
      </nav>

      {/* account */}
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
            {admin?.fullName?.[0]?.toUpperCase() || "A"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {admin?.fullName || "Admin"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {admin?.email || "Store manager"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1 border-t border-gray-100 pt-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
