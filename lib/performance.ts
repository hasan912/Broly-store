// Performance optimization utilities

// Lazy load components with loading fallback
export function createLazyComponent(Component: any, loadingComponent?: any) {
  return {
    Component,
    Loading: loadingComponent || (() => <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" /></div>),
  };
}

// Image optimization helper
export const imageOptimization = {
  loader: ({ src, width, quality }: any) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  },
};

// Preload images
export function preloadImage(src: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
}

// Debounce function for search and filters
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      callback();
      observer.unobserve(entry.target);
    }
  }, options);

  return observer;
}

// Analytics tracking with minimal overhead
export function trackEvent(name: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, data);
  }
}
