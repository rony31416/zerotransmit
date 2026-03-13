'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface RevealSectionProps {
    children: ReactNode;
    direction?: 'left' | 'right';
    delay?: number;
    className?: string;
}

export default function RevealSection({
    children,
    direction = 'left',
    delay = 0,
    className = '',
}: RevealSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Re-triggers every time element enters/exits viewport
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.08 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const translateClass =
        direction === 'left'
            ? visible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-16 opacity-0'
            : visible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-16 opacity-0';

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${translateClass} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
