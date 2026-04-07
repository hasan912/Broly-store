'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { itemCount } = useCart();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${isScrolled ? 'bg-[rgba(249,249,249,0.8)] backdrop-blur-xl border-b border-[#e8e8e8] py-4' : 'bg-transparent py-6'}`}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 flex items-center justify-center transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <Image src="/logo.PNG" alt="Logo" width={32} height={32} className="opacity-90 mix-blend-multiply" />
            </div>
            <span className="hidden sm:inline font-serif text-xl tracking-tighter text-[#1a1c1c]">NO CAPS</span>
          </Link>

          <div className="hidden lg:flex items-center gap-12">
            <NavLink href="/products" label="THE COLLECTION" />
            <NavLink href="/about" label="OUR CRAFT" />
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/cart"
              className="relative transition-colors text-[#5e5e5e] hover:text-[#000000]"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-[9px] rounded-none w-4 h-4 flex items-center justify-center font-mono bg-[#000000] text-[#ffffff]"
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                href="/logout"
                className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-[10px] uppercase tracking-widest hidden sm:flex items-center text-[#5e5e5e] hover:text-[#000000]"
              >
                <span>Logout</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 border border-[#e8e8e8] hover:border-[#000000] transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] text-[10px] uppercase tracking-widest hidden sm:flex items-center text-[#1a1c1c] bg-[#ffffff] hover:bg-[#000000] hover:text-[#ffffff]"
              >
                <span>Client Login</span>
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden transition-colors text-[#5e5e5e] hover:text-[#000000]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#f9f9f9] border-b border-[#e8e8e8] py-4 space-y-2 animate-fade-down shadow-sm">
            <MobileNavLink href="/" label="HOME" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/about" label="OUR CRAFT" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink href="/products" label="THE COLLECTION" onClick={() => setIsMobileMenuOpen(false)} />
            {user ? (
              <MobileNavLink href="/logout" label="LOGOUT" onClick={() => setIsMobileMenuOpen(false)} />
            ) : (
              <MobileNavLink href="/login" label="CLIENT LOGIN" onClick={() => setIsMobileMenuOpen(false)} />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

type NavLinkProps = {
  href: string;
  label: string;
};

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center transition-colors duration-500 relative text-[#5e5e5e] hover:text-[#000000]"
    >
      <span className="text-[10px] font-mono tracking-widest uppercase">{label}</span>
      <span
        className="absolute -bottom-2 w-0 h-px bg-[#000000] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full opacity-50"
      />
    </Link>
  );
}

type MobileNavLinkProps = {
  href: string;
  label: string;
  onClick: () => void;
};

function MobileNavLink({ href, label, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-6 py-3 transition-all duration-300 text-[#5e5e5e] hover:text-[#000000] hover:bg-[#e8e8e8]"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
    </Link>
  );
}
