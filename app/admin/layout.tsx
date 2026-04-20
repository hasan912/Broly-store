import AdminSidebar from '@/components/AdminSidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('broly_admin_session')?.value;

  if (adminSession !== 'active') {
    redirect('/admin/login?redirect=/admin');
  }

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden relative">
        {/* Ambient Studio Effect */}
        <div className="absolute inset-0 studio-ambient pointer-events-none" />
        
        <div className="relative z-10 w-full min-h-screen pt-16 md:pt-20">
          {children}
        </div>
      </main>
    </div>
  );
}
