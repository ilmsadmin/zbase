import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect from the root route to the admin dashboard if authenticated or login if not
  // Using /admin/dashboard as target - middleware will handle redirect to login if needed
  redirect('/admin/dashboard');
}
