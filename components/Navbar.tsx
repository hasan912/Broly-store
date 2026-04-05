'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart,
  LogOut,
  LogIn,
  Home,
  Info,
  Package,
  Shield,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export default function Navbar() {
  const { itemCount } = useCart();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md"
      suppressHydrationWarning
      style={{ 
        backgroundColor: mounted && isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
        borderBottom: '1px solid rgba(231, 229, 228, 0.6)',
        boxShadow: mounted && isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="#" className="flex items-center gap-3 group">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
            >
              <Image src="/logo.PNG" alt="Logo" width={40} height={40} />
            </div>
            <span className="hidden sm:inline text-xl font-bold" style={{ color: '#4f46e5' }}>Broly Store</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <NavLink href="/" icon={Home} label="Home" />
            <NavLink href="/about" icon={Info} label="About" />
            <NavLink href="/products" icon={Package} label="Products" />
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/cart" 
              className="relative p-2.5 rounded-lg transition-all duration-300"
              style={{ color: '#1c1917' }}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#ffffff' }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                href="/logout"
                className="px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium hidden sm:flex items-center gap-2"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium hidden sm:flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#ffffff' }}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2.5 rounded-lg transition-colors"
              style={{ color: '#1c1917' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-fade-in-up">
            <MobileNavLink href="/" icon={Home} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/about" icon={Info} label="About" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/products" icon={Package} label="Products" onClick={() => setIsMobileMenuOpen(false)} />            <MobileNavLink href="/admin/login" icon={Shield} label="Admin" onClick={() => setIsMobileMenuOpen(false)} />
            {user ? (
              <MobileNavLink href="/logout" icon={LogOut} label="Logout" onClick={() => setIsMobileMenuOpen(false)} />
            ) : (
              <MobileNavLink href="/login" icon={LogIn} label="Login" onClick={() => setIsMobileMenuOpen(false)} />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

type NavLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
};

function NavLink({ href, icon: Icon, label }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-2 transition-colors duration-300 relative"
      style={{ color: '#57534e' }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
      <span 
        className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
      />
    </Link>
  );
}

type MobileNavLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

function MobileNavLink({ href, icon: Icon, label, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
      style={{ color: '#57534e' }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
