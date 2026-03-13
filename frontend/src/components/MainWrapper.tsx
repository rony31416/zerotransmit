'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <main className={isHome ? 'w-full' : 'container mx-auto px-4 py-8'}>
            {children}
        </main>
    );
}
