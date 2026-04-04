import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Package } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20" style={{ backgroundColor: '#fafaf9', borderTop: '1px solid #e7e5e4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                <Package className="w-5 h-5" style={{ color: '#ffffff' }} />
              </div>
              <span className="text-lg font-bold" style={{ color: '#1c1917' }}>Broly Caps</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#57534e' }}>
              Premium caps crafted for style and everyday wear.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: '#1c1917' }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/about', label: 'About' },
                { href: '/admin/login', label: 'Admin' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-300"
                    style={{ color: '#57534e' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: '#1c1917' }}>
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/shipping', label: 'Shipping' },
                { href: '/returns', label: 'Returns' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-300"
                    style={{ color: '#57534e' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: '#1c1917' }}>
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/terms', label: 'Terms' },
                { href: '/privacy', label: 'Privacy' },
                { href: '/cookies', label: 'Cookies' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-300"
                    style={{ color: '#57534e' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #d6d3d1, transparent)' }} />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: '#78716c' }}>
          <div className="flex flex-col gap-2">
            <p>
              &copy; {currentYear} Broly Store. All rights reserved.
            </p>
            
          </div>
          <p className="text-xs">
            Designed & developed by{' '}
            <a
              href="https://hasanbaig.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors duration-300 hover:text-indigo-600"
              style={{ color: '#6366f1' }}
            >
              Muhammad Hasan Baig
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
