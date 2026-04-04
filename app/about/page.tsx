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
      title: 'Customer First',
      description: 'Everything we do is centered around creating exceptional experiences for our customers.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We never compromise on quality. Each product is carefully selected and tested.',
    },
    {
      icon: Target,
      title: 'Modern Design',
      description: 'Combining timeless style with contemporary aesthetics for everyday elegance.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            About Broly Caps
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're passionate about bringing premium headwear to customers worldwide. 
            Our mission is to make style accessible, authentic, and exceptional.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card3D depth="lg">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Journey</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded with a vision to redefine headwear, Broly Caps started as a small initiative 
                built on the belief that quality caps should be accessible to everyone who values 
                style and comfort.
              </p>
              <p>
                What began as a passion project has grown into a trusted brand serving customers 
                who appreciate the perfect blend of modern design and timeless craftsmanship. 
                Every cap in our collection is carefully selected to meet the highest standards 
                of quality and style.
              </p>
              <p>
                Today, we're proud to offer a curated collection of premium caps that combine 
                comfort, durability, and contemporary aesthetics. Our dedicated team works 
                tirelessly to ensure every customer receives exceptional service from browsing 
                to delivery.
              </p>
            </div>
          </Card3D>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-gradient-calm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">What Drives Us</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card3D key={index} className="text-center group h-full">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  To create premium headwear that empowers individuals to express their unique 
                  style with confidence and comfort.
                </p>
                <p>
                  We believe that the right cap is more than an accessory—it's a statement of 
                  who you are. That's why we're committed to delivering products that combine 
                  exceptional quality with modern design.
                </p>
              </div>
            </div>
            
            <Card3D depth="lg" className="bg-gradient-to-br from-primary/5 to-accent/5 p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Customer-Centric</h4>
                    <p className="text-sm text-muted-foreground">Your satisfaction drives everything we do</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Quality Focused</h4>
                    <p className="text-sm text-muted-foreground">Never compromising on materials or craftsmanship</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Innovation</h4>
                    <p className="text-sm text-muted-foreground">Constantly evolving our designs and service</p>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card3D depth="lg" className="text-center p-12 md:p-16 bg-gradient-to-br from-card to-primary/5">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Discover Your Perfect Cap?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our collection and experience the difference that quality and style make.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white rounded-lg shadow-soft hover:shadow-elevated transition-all duration-300 font-semibold depth-interactive"
            >
              Browse Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Card3D>
        </div>
      </section>
    </div>
  );
}
