"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PropsWithChildren } from "react";

interface RoleGuardProps extends PropsWithChildren {
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;    if (!session) {
      router.push(redirectTo);
      return;
    }

    const userRole = session.user.role?.toUpperCase();    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      router.push("/unauthorized");
    }
  }, [session, status, allowedRoles, redirectTo, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (!session || !allowedRoles.map(role => role.toUpperCase()).includes(session.user.role?.toUpperCase())) {
    return null;
  }

  return <>{children}</>;
}
