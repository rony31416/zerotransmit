'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface AnimatedSectionProps {
    title: string;
    description: string;
    bullets: string[];
    imageSrc: string;
    imageAlt: string;
    reverse?: boolean;
    accentColor?: string;
    bgColor?: string;
    icon?: string;
}

export default function AnimatedSection({
    title,
    description,
    bullets,
    imageSrc,
    imageAlt,
    reverse = false,
    accentColor = 'from-teal-500 to-emerald-600',
    bgColor = 'bg-teal-50',
    icon = '🔬',
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const textClass = reverse
        ? visible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-12 md:translate-x-24 opacity-0'
        : visible
            ? 'translate-x-0 opacity-100'
            : '-translate-x-12 md:-translate-x-24 opacity-0';

    const imgClass = reverse
        ? visible
            ? 'translate-x-0 opacity-100'
            : '-translate-x-12 md:-translate-x-24 opacity-0'
        : visible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-12 md:translate-x-24 opacity-0';

    return (
        <div ref={ref} className={`${bgColor} w-full flex items-center justify-center min-h-screen py-16`}>
            <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20 w-full max-w-[1500px] px-8 md:px-16`}>

                {/* Image side - Large, object-contain to preserve full image */}
                <div
                    className={`w-full md:w-1/2 flex justify-center transition-all duration-1000 ease-out ${imgClass}`}
                >
                    <div className={`relative w-full h-[50vh] md:h-[65vh] min-h-[400px] rounded-[36px] overflow-hidden shadow-2xl bg-white/60 p-6 border-[8px] border-white backdrop-blur-md`}>
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="object-contain p-2 mix-blend-multiply"
                        />
                    </div>
                </div>

                {/* Text side */}
                <div
                    className={`w-full md:w-1/2 transition-all duration-1000 ease-out delay-150 ${textClass}`}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <span className="text-3xl">{icon}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">{title}</h2>
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">{description}</p>

                    <div className="space-y-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
                        {bullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`mt-1 bg-gradient-to-br ${accentColor} w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm`}>
                                    ✓
                                </div>
                                <span className="text-gray-700 text-base md:text-lg font-medium">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

