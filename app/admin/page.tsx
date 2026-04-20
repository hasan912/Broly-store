'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Package, ShoppingBag, DollarSign, Users, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card3D } from '@/components/ui/card-3d';

import LoadingSpinner from '@/components/LoadingSpinner';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnapshot.size;
        let totalRevenue = 0;
        ordersSnapshot.forEach((doc) => {
          totalRevenue += doc.data().total || 0;
        });

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          totalUsers,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'TOTAL PRODUCTS',
      value: stats.totalProducts,
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'TOTAL ORDERS',
      value: stats.totalOrders,
      icon: ShoppingBag,
      href: '/admin/orders',
    },
    {
      title: 'TOTAL REVENUE',
      value: `PKR ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      href: '/admin/orders',
    },
    {
      title: 'TOTAL USERS',
      value: stats.totalUsers,
      icon: Users,
      href: '#',
    },
  ];

  const quickActions = [
    {
      title: 'ADD NEW PRODUCT',
      description: 'Create a new product listing in the inventory.',
      href: '/admin/products/new',
    },
    {
      title: 'VIEW ORDERS',
      description: 'Manage and fulfill current customer orders.',
      href: '/admin/orders',
    },
    {
      title: 'MANAGE PRODUCTS',
      description: 'Edit, update, or archive existing products.',
      href: '/admin/products',
    },
    {
      title: 'VISIT STOREFRONT',
      description: 'See how changes appear to your customers.',
      href: '/',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 px-3 py-1 bg-primary" />
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary uppercase">CONSOLE</h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground tracking-wide max-w-2xl">
          Welcome to the management console. Oversee your inventory, orders, and business performance from a unified architectural interface.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group">
              <Card3D className="h-full border-border/40 hover:border-primary transition-colors duration-700" hover={true}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                       <Icon className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                       <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-2">{card.title}</p>
                    <p className="text-4xl font-serif text-primary tracking-tighter">{card.value}</p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-border/20">
                     <span className="text-[10px] font-bold text-primary group-hover:tracking-widest transition-all duration-500">VIEW DETAILS</span>
                  </div>
                </div>
              </Card3D>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-[0.15em] text-primary uppercase mb-2">QUICK ACTIONS</h2>
            <div className="h-px bg-border/40 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative"
              >
                <div className="p-8 border border-border/40 bg-white hover:bg-muted transition-all duration-700 h-full flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-xs font-bold tracking-[0.2em] text-primary mb-3">{action.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    EXECUTE <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
}
