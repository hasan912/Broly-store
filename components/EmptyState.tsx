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
    <div className="flex flex-col items-center justify-center w-full py-24 px-8 border border-[#e8e8e8] bg-[#ffffff] relative overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-b from-[#f9f9f9] to-transparent pointer-events-none" />
      
      {icon && (
        <div className="mb-10 w-20 h-20 flex items-center justify-center rounded-none bg-[#f3f3f3] border border-[#e8e8e8] relative z-10 transition-all duration-700 group-hover:bg-[#e2e2e2] group-hover:border-[#c6c6c6] group-hover:-translate-y-2">
          {icon}
        </div>
      )}
      
      <h2 className="text-2xl md:text-3xl font-serif text-[#000000] mb-4 text-center relative z-10 tracking-wide">
        {title}
      </h2>
      <p className="text-sm font-sans text-[#474747] leading-[1.8] text-center max-w-md mb-10 relative z-10">
        {description}
      </p>
      
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="relative z-10 flex items-center gap-3 px-8 py-4 border border-[#000000] text-[#000000] text-xs font-mono uppercase tracking-[0.2em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#000000] hover:text-[#e5e2e1]"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
