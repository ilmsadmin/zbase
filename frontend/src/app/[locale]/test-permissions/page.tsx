"use client";

import { useAbility } from "@/abilities/AbilityContext";
import MainLayout from "@/components/layouts/MainLayout";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function TestPermissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const ability = useAbility();
  const t = useTranslations();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <MainLayout>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('permissions.title')}</h1>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('permissions.userInfo.title')}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {t('permissions.userInfo.subtitle')}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('permissions.userInfo.name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session.user.name || t('permissions.userInfo.notUpdated')}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('permissions.userInfo.email')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session.user.email}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('permissions.userInfo.role')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {session.user.role}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('permissions.abilities.title')}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {t('permissions.abilities.subtitle')}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <Permission
                  name={t('permissions.abilities.manageUsers.name')}
                  description={t('permissions.abilities.manageUsers.description')}
                  can={ability.can("manage", "User")}
                  t={t}
                />
                <Permission
                  name={t('permissions.abilities.readPosts.name')}
                  description={t('permissions.abilities.readPosts.description')}
                  can={ability.can("read", "Post")}
                  t={t}
                />
                <Permission
                  name={t('permissions.abilities.createPosts.name')}
                  description={t('permissions.abilities.createPosts.description')}
                  can={ability.can("create", "Post")}
                  t={t}
                />
                <Permission
                  name={t('permissions.abilities.managePosts.name')}
                  description={t('permissions.abilities.managePosts.description')}
                  can={ability.can("manage", "Post")}
                  t={t}
                />
                <Permission
                  name={t('permissions.abilities.manageComments.name')}
                  description={t('permissions.abilities.manageComments.description')}
                  can={ability.can("manage", "Comment")}
                  t={t}
                />
                <Permission
                  name={t('permissions.abilities.manageAll.name')}
                  description={t('permissions.abilities.manageAll.description')}
                  can={ability.can("manage", "all")}
                  t={t}
                />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Permission({
  name,
  description,
  can,
  t
}: {
  name: string;
  description: string;
  can: boolean;
  t: any;
}) {
  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">
        <div>{name}</div>
        <div className="text-xs text-gray-400 mt-1">{description}</div>
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
        {can ? (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {t('permissions.allowed')}
          </span>
        ) : (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            {t('permissions.denied')}
          </span>
        )}
      </dd>
    </div>
  );
}
