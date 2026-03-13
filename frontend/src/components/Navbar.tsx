'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', emoji: '🏠' },
    { href: '/risk-engine', label: 'Risk Assessment', emoji: '🛡️' },
    { href: '/chatbot', label: 'Chatbot', emoji: '💬' },
    { href: '/counseling', label: 'Counseling', emoji: '🧠' },
    { href: '/geomap', label: 'GeoMap', emoji: '🗺️' },
  ];

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
              <Image src="/images/icon.png" alt="Icon" fill className="object-contain" />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                ZeroTransmit
              </div>
              <div className="text-xs text-gray-500 font-medium">Health Protection Platform</div>
            </div>
          </Link>

          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                    }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
