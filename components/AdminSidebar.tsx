'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ];

  if (!mounted) {
    return <aside className="hidden lg:block lg:w-64 bg-card border-r border-border" aria-hidden />;
  }

  return (
    <>
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-3 bg-card border border-border rounded-lg shadow-soft hover:shadow-elevated transition-all"
          aria-label="Toggle admin menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:h-[calc(100vh-5rem)] lg:sticky lg:top-20 bg-card border-r border-border">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/admin/logout"
              className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16 md:pt-20`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/admin/logout"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
