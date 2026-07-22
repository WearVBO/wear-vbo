"use client";
import React, { useState } from "react";
import { LogOut, Plus, ShieldCheck } from "lucide-react";
import {
  AdminButton,
  Card,
  EmptyState,
  PageHeader,
} from "@/components/admin/ui/AdminUI";
import CreateAdminModal from "@/components/admin/CreateAdminModal";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { AdminUser } from "@/lib/adminAuth";

const AdminManagement = () => {
  const { admin, logout } = useAdminAuth();
  const [modalOpen, setModalOpen] = useState(false);
  // The API exposes no "list admins" endpoint, so this holds admins created
  // during this session, shown alongside the signed-in admin.
  const [created, setCreated] = useState<AdminUser[]>([]);

  const admins = [
    ...(admin ? [admin] : []),
    ...created.filter((item) => item.email !== admin?.email),
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin management"
        subtitle={
          admin ? `Signed in as ${admin.fullName}` : "Manage admin accounts."
        }
        action={
          <div className="flex flex-wrap gap-3">
            <AdminButton variant="outline" onClick={logout}>
              <LogOut size={16} /> Log out
            </AdminButton>
            <AdminButton onClick={() => setModalOpen(true)}>
              <Plus size={17} /> Create Admin
            </AdminButton>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 px-4 md:px-6 py-4">
          <h2 className="font-semibold">Admins</h2>
          <p className="mt-1 text-sm text-gray-500">
            Accounts with full access to this dashboard.
          </p>
        </div>

        {admins.length === 0 ? (
          <EmptyState
            title="No admin loaded"
            description="Your session details could not be read. Try signing in again."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {admins.map((item) => (
              <div
                key={item.email}
                className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
                  {item.fullName?.[0]?.toUpperCase() || "A"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {item.fullName}
                    {item.email === admin?.email && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        you
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-gray-500">{item.email}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                  <ShieldCheck size={13} /> {item.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="text-sm text-gray-500">
        Admin accounts cannot be created from the public site. Creating one
        requires an active admin session plus the server&apos;s admin secret.
      </p>

      {modalOpen && (
        <CreateAdminModal
          onClose={() => setModalOpen(false)}
          onCreated={(newAdmin) =>
            setCreated((prev) => [...prev, newAdmin])
          }
        />
      )}
    </div>
  );
};

export default AdminManagement;
