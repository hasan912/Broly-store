'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { href: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
    { href: '/admin/products', label: 'PRODUCTS', icon: Package },
    { href: '/admin/orders', label: 'ORDERS', icon: ShoppingBag },
  ];

  if (!mounted) {
    return <aside className="hidden lg:block lg:w-72 bg-white border-r border-border" aria-hidden />;
  }

  return (
    <>
      <div className="lg:hidden fixed top-24 left-6 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-4 bg-white border border-border shadow-soft hover:bg-muted transition-all duration-500"
          aria-label="Toggle admin menu"
        >
          {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
        </button>
      </div>

      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:h-screen lg:sticky lg:top-0 bg-white border-r border-border z-40">
        <div className="h-full flex flex-col">
          <div className="p-10 border-b border-border">
            <Link href="/admin" className="group">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-serif tracking-tight text-primary leading-none uppercase">STITCH</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Management Console</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-6 py-10 space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between group px-6 py-4 transition-all duration-700 ease-out ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary'}`} />
                    <span className="text-xs font-bold tracking-[0.15em]">{item.label}</span>
                  </div>
                  {!isActive && (
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-6">
            <Link
              href="/admin/logout"
              className="flex items-center gap-4 px-6 py-4 text-xs font-bold tracking-[0.15em] text-destructive hover:bg-destructive/5 transition-all duration-500 group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
              <span>LOGOUT</span>
            </Link>
          </div>
        </div>
      </aside>

      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-1000 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`h-full w-80 bg-white border-r border-border transform transition-transform duration-700 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-10 border-b border-border">
            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-serif tracking-tight text-primary leading-none uppercase">STITCH</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Management Console</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-6 py-10 space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between group px-6 py-4 transition-all duration-700 ease-out ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary'}`} />
                    <span className="text-xs font-bold tracking-[0.15em]">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-6">
            <Link
              href="/admin/logout"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-6 py-4 text-xs font-bold tracking-[0.15em] text-destructive hover:bg-destructive/5 transition-all duration-500"
            >
              <LogOut className="w-5 h-5" />
              <span>LOGOUT</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
