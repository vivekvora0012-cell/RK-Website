'use client';

import * as React from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
  distance?: number;
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.8,
  className = '',
  distance = 30,
}: FadeInProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) return;
    
    // Fallback for older browsers
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    if (direction === 'none') return 'none';
    if (direction === 'up') return `translateY(${distance}px)`;
    if (direction === 'down') return `translateY(-${distance}px)`;
    if (direction === 'left') return `translateX(${distance}px)`;
    if (direction === 'right') return `translateX(-${distance}px)`;
    return 'none';
  };

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
