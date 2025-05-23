"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { useTranslations } from "next-intl";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";

export default function AdminPage() {
  const t = useTranslations("admin");    return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="py-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="sr-only">{t("dashboard")}</h1>
            <AdminDashboard />
          </div>
        </div>
      </AdminLayout>
    </RoleGuard>
  );
}
