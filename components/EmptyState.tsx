import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl shadow-lg p-12"
      style={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}
    >
      {icon && (
        <div 
          className="mb-6 p-6 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)' }}
        >
          {icon}
        </div>
      )}
      <h2 className="text-3xl font-bold mb-3 text-center" style={{ color: '#1c1917' }}>{title}</h2>
      <p className="text-center max-w-md mb-8 leading-relaxed" style={{ color: '#57534e' }}>{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', color: '#ffffff' }}
        >
          {actionLabel}
          <ArrowRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
