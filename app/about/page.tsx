import Link from 'next/link';
import { Heart, Users, Sparkles, ArrowRight, Target, Award } from 'lucide-react';
import { Card3D } from '@/components/ui/card-3d';

export const metadata = {
  title: 'About Us | Broly Caps',
  description: 'Learn about our story, mission, and values at Broly Caps.',
};

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Client First',
      description: 'Everything we construct is centered around creating exceptional spatial experiences for our clients.',
    },
    {
      icon: Award,
      title: 'Premium Integrity',
      description: 'We never compromise on structure. Each piece is meticulously engineered and tested.',
    },
    {
      icon: Target,
      title: 'Structural Design',
      description: 'Combining timeless silhouettes with contemporary architectural aesthetics for everyday elegance.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] selection:bg-[#000000] selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative py-28 md:py-40 overflow-hidden border-b border-[#e8e8e8]">
        <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 blur-[100px] bg-[rgba(26,28,28,0.03)] pointer-events-none rounded-none" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-8 bg-[#000000]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#000000]">
              Our Foundation
            </span>
            <div className="h-px w-8 bg-[#000000]" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#000000] mb-8 leading-[1.1]">
            About <span className="italic font-light text-[#5e5e5e]">BROLY STORE</span>
          </h1>
          <p className="text-sm md:text-base font-sans text-[#474747] leading-[1.8] max-w-2xl mx-auto">
            We engineer high-fidelity Broly Store products for individuals who understand that true luxury lies in structural honesty and absolute minimalism.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="p-10 md:p-16 bg-[#ffffff] border border-[#e8e8e8] rounded-none relative overflow-hidden group hover:border-[#c6c6c6] transition-colors duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm">
            <div className="absolute inset-0 bg-linear-to-b from-[#f3f3f3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h2 className="text-3xl font-serif text-[#000000] mb-8 relative z-10">Our Evolution</h2>
            <div className="space-y-6 text-sm leading-[1.8] text-[#5e5e5e] relative z-10">
              <p>
                Established with a vision to deconstruct standard streetwear, Broly Store began as a study in spatial geometry, built on the principle that everyday accessories should possess the same structural integrity as modern architecture.
              </p>
              <p>
                What began as a localized project has evolved into a definitive destination for clients who demand the intersection of high-grade materials and industrial design. We analyze seams, tensions, and fabric behaviors to produce pieces that maintain form in any environment.
              </p>
              <p>
                Today, our studio brings forth curated Broly Store collections that balance atmospheric minimalism with robust durability. We approach every stitch not simply as a means of joining fabric, but as an architectural decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 border-y border-[#e8e8e8] bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-8 bg-[#1a1c1c]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#5e5e5e]">Core Mechanics</span>
              <div className="h-px w-8 bg-[#1a1c1c]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#000000]">Our Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="p-10 bg-[#ffffff] border border-[#e8e8e8] rounded-none group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-[#c6c6c6] text-center flex flex-col items-center shadow-sm">
                <div className="mb-8 w-14 h-14 border border-[#e8e8e8] bg-[#f9f9f9] group-hover:bg-[#1a1c1c] group-hover:border-[#1a1c1c] flex items-center justify-center rounded-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <value.icon className="h-5 w-5 text-[#5e5e5e] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-serif text-[#000000] mb-4 tracking-wide">{value.title}</h3>
                <p className="text-sm text-[#474747] leading-[1.8]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-[#1a1c1c]" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#5e5e5e]">Objective</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-[#000000] mb-8">
                The Mission
              </h2>
              <div className="space-y-6 text-sm text-[#474747] leading-[1.8]">
                <p>
                  To engineer premium Broly Store products that translate spatial aesthetics into wearable form, enabling our clients to present a sophisticated, uncompromising silhouette.
                </p>
                <p>
                  A Broly Store piece is not a mere addition; it is the capstone of your visual identity. We dedicate our resources to sourcing zero-compromise materials and applying exact geometric tolerances to every product in the archives.
                </p>
              </div>
            </div>
            
            <div className="bg-[#ffffff] border border-[#e8e8e8] p-12 rounded-none relative overflow-hidden shadow-sm">
               <div className="absolute inset-0 bg-linear-to-br from-[#f9f9f9] to-transparent pointer-events-none" />
              <div className="space-y-10 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="p-3 border border-[#e8e8e8] rounded-none bg-[#f9f9f9]">
                    <Users className="w-4 h-4 text-[#1a1c1c]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#000000] mb-2 tracking-wide text-lg">Client Focus</h4>
                    <p className="text-xs font-mono text-[#5e5e5e] tracking-widest uppercase">Absolute alignment with user intent</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-3 border border-[#e8e8e8] rounded-none bg-[#f9f9f9]">
                    <Award className="w-4 h-4 text-[#1a1c1c]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#000000] mb-2 tracking-wide text-lg">Structural Fidelity</h4>
                    <p className="text-xs font-mono text-[#5e5e5e] tracking-widest uppercase">Strict adherence to material limits</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-3 border border-[#e8e8e8] rounded-none bg-[#f9f9f9]">
                    <Sparkles className="w-4 h-4 text-[#1a1c1c]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#000000] mb-2 tracking-wide text-lg">Constant R&D</h4>
                    <p className="text-xs font-mono text-[#5e5e5e] tracking-widest uppercase">Iterative aesthetic refinement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-[#e8e8e8] bg-[#f3f3f3]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center p-12 md:p-20 bg-[#ffffff] border border-[#e8e8e8] rounded-none relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-linear-to-b from-[#f9f9f9] to-transparent pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-serif text-[#000000] mb-6">
              Initiate Acquisition
            </h2>
            <p className="text-sm text-[#474747] mb-10 max-w-xl mx-auto leading-[1.8]">
              Peruse our archives and analyze our current structural offerings to find the precise fit for your spatial environment.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#000000] text-[#ffffff] text-xs uppercase tracking-widest transition-all duration-700 hover:bg-[#5e5e5e]"
            >
              Access Archives
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
