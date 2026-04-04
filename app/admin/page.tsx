'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Package, ShoppingBag, DollarSign, Users, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card3D } from '@/components/ui/card-3d';

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
        // Get products count
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // Get orders and calculate revenue
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnapshot.size;
        let totalRevenue = 0;
        ordersSnapshot.forEach((doc) => {
          totalRevenue += doc.data().total || 0;
        });

        // Get users count
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
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-primary to-primary/80',
      href: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      gradient: 'from-accent to-accent/80',
      href: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-600',
      href: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-primary/70 to-accent/70',
      href: '#',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      href: '/admin/products/new',
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      href: '/admin/orders',
    },
    {
      title: 'Manage Products',
      description: 'Edit existing products',
      href: '/admin/products',
    },
    {
      title: 'View Store',
      description: 'Visit the public store',
      href: '/',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card3D className="group cursor-pointer h-full" hover={true}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-linear-to-br ${card.gradient} shadow-soft`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
              </Card3D>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card3D depth="lg">
        <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="p-5 border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex items-center justify-between group"
            >
              <div>
                <p className="font-semibold text-foreground mb-1">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </Card3D>
    </div>
  );
}
