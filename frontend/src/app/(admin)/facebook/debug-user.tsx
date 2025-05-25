'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DebugUser() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('🐛 [DebugUser] Current auth state:', {
    isLoading,
    isAuthenticated,
    user: user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: user.permissions
    } : null
  });

  if (isLoading) {
    return <div>Loading user info...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded mb-4">
      <h3 className="font-bold text-yellow-800">Debug User Info:</h3>
      <pre className="text-sm text-yellow-700 mt-2">
        {JSON.stringify({
          id: user?.id,
          email: user?.email, 
          role: user?.role,
          permissions: user?.permissions
        }, null, 2)}
      </pre>
    </div>
  );
}
