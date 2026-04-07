import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f9f9f9] border-t border-[#e8e8e8] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20 border-b border-[#e8e8e8] pb-16">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl tracking-tighter text-[#000000]">NO CAPS</span>
            </Link>
            <p className="text-[#5e5e5e] text-sm font-sans max-w-xs mb-6">
              Precision engineered headwear for the exactest physical space.
            </p>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#000000]">
              EST. 2026 // MILAN
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#000000] mb-6">Index</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">The Collection</Link></li>
              <li><Link href="/about" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Fabrication</Link></li>
              <li><Link href="/categories" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Sectors</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#000000] mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Logistics & Returns</Link></li>
              <li><Link href="#" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Material Care</Link></li>
              <li><Link href="#" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Contact Matrix</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#000000] mb-6">Legal Protocol</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-[#5e5e5e] hover:text-[#000000] transition-colors">Privacy Directive</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Tag */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#5e5e5e]">
            &copy; {new Date().getFullYear()} Atelier Monolith. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[#5e5e5e] hover:text-[#000000] text-[10px] font-mono tracking-widest uppercase transition-colors">TW / X</Link>
            <Link href="#" className="text-[#5e5e5e] hover:text-[#000000] text-[10px] font-mono tracking-widest uppercase transition-colors">INSTA</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
