'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });

export default function Home() {
  const features = [
    {
      title: 'ঝুঁকি নির্ণয়',
      description: 'AI-ভিত্তিক ব্যক্তিগত এইচআইভি ঝুঁকি মূল্যায়ন — আপনার আচরণ ও স্বাস্থ্য তথ্যের উপর ভিত্তি করে।',
      emoji: '🛡️',
      href: '/risk-engine',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'চ্যাটবট সহায়তা',
      description: 'এইচআইভি প্রতিরোধ, পরীক্ষা ও চিকিৎসা সম্পর্কে বাংলা বা ইংরেজিতে তাৎক্ষণিক উত্তর পান।',
      emoji: '💬',
      href: '/chatbot',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'মানসিক স্বাস্থ্য কাউন্সেলিং',
      description: 'এইচআইভির সাথে জীবনযাপন, ওষুধ গ্রহণ এবং আবেগীয় সুস্থতার জন্য CBT-ভিত্তিক সহায়তা।',
      emoji: '🧠',
      href: '/counseling',
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      title: 'ভৌগোলিক বিশ্লেষণ',
      description: 'বাংলাদেশের বিভিন্ন অঞ্চলে এইচআইভি কেসের হটস্পট, প্রবণতা ও পূর্বাভাস দেখুন।',
      emoji: '🗺️',
      href: '/geomap',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  const sections = [
    {
      title: 'এইচআইভি কী?',
      description: 'এইচআইভি (Human Immunodeficiency Virus) হলো একটি ভাইরাস যা মানুষের শরীরের রোগ প্রতিরোধ ক্ষমতাকে দুর্বল করে দেয়। এই ভাইরাস মূলত শরীরের ইমিউন সিস্টেমের গুরুত্বপূর্ণ CD4 কোষগুলোকে আক্রমণ করে। যদি যথাযথ চিকিৎসা না করা হয়, তাহলে এটি পরবর্তীতে এইডস (AIDS)-এ রূপ নিতে পারে।',
      bullets: [
        'এইচআইভি একটি ভাইরাস যা রোগ প্রতিরোধ ক্ষমতা নষ্ট করে',
        'এটি CD4 কোষ আক্রমণ করে শরীরকে দুর্বল করে',
        'চিকিৎসা না করলে এটি এইডস হতে পারে',
        'বর্তমানে সম্পূর্ণ নিরাময় নেই, তবে চিকিৎসার মাধ্যমে নিয়ন্ত্রণ সম্ভব',
        'নিয়মিত চিকিৎসা নিলে দীর্ঘদিন সুস্থভাবে জীবনযাপন করা যায়',
      ],
      imageSrc: '/images/hiv_virus.jpeg',
      imageAlt: 'এইচআইভি ভাইরাস',
      reverse: false,
      accentColor: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50',
      icon: '🔬',
    },
    {
      title: 'কিভাবে এইচআইভি ছড়ায়?',
      description: 'এইচআইভি সাধারণত নির্দিষ্ট কিছু উপায়ে একজন মানুষ থেকে অন্যজনের শরীরে প্রবেশ করে। প্রধানত রক্ত, বীর্য, যোনি তরল বা মায়ের দুধের মাধ্যমে এই ভাইরাস ছড়াতে পারে। দৈনন্দিন সাধারণ যোগাযোগের মাধ্যমে এই ভাইরাস ছড়ায় না।',
      bullets: [
        'অসুরক্ষিত যৌন সম্পর্কের মাধ্যমে',
        'সংক্রমিত রক্ত শরীরে প্রবেশ করলে',
        'একই সুচ বা সিরিঞ্জ ব্যবহার করলে',
        'গর্ভাবস্থা, জন্ম বা বুকের দুধের মাধ্যমে মা থেকে শিশুতে',
        'হাত মেলানো, আলিঙ্গন বা কাশির মাধ্যমে ছড়ায় না',
      ],
      imageSrc: '/images/bangladeshi_women_with_aids_symbol.webp',
      imageAlt: 'এইচআইভি সংক্রমণের পথ',
      reverse: true,
      accentColor: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      icon: '⚠️',
    },
    {
      title: 'লক্ষণ',
      description: 'এইচআইভি সংক্রমণের প্রাথমিক পর্যায়ে অনেক সময় স্পষ্ট লক্ষণ দেখা যায় না। অনেক ক্ষেত্রে সাধারণ জ্বর বা ফ্লু-এর মতো লক্ষণ দেখা দিতে পারে। সময়ের সাথে শরীরের রোগ প্রতিরোধ ক্ষমতা দুর্বল হলে বিভিন্ন সংক্রমণ দেখা দিতে পারে।',
      bullets: [
        'দীর্ঘদিন জ্বর থাকা',
        'অস্বাভাবিক ক্লান্তি ও দুর্বলতা',
        'ওজন অস্বাভাবিকভাবে কমে যাওয়া',
        'বারবার সংক্রমণ হওয়া',
        'শরীরে ফুসকুড়ি বা ঘা',
        'লিম্ফ নোড ফুলে যাওয়া',
      ],
      imageSrc: '/images/HIV_Symptoms.webp',
      imageAlt: 'এইচআইভির লক্ষণ',
      reverse: false,
      accentColor: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      icon: '🌡️',
    },
    {
      title: 'চিকিৎসা',
      description: 'বর্তমানে এইচআইভির সম্পূর্ণ নিরাময় নেই, তবে আধুনিক চিকিৎসার মাধ্যমে এই ভাইরাসকে নিয়ন্ত্রণ করা সম্ভব। অ্যান্টিরেট্রোভাইরাল থেরাপি (ART) নামক ওষুধ নিয়মিত গ্রহণ করলে ভাইরাসের পরিমাণ কমে যায়।',
      bullets: [
        'অ্যান্টিরেট্রোভাইরাল থেরাপি (ART) ব্যবহার করা হয়',
        'নিয়মিত ওষুধ গ্রহণ অত্যন্ত গুরুত্বপূর্ণ',
        'চিকিৎসা নিলে ভাইরাসের সংক্রমণ ঝুঁকি কমে যায়',
        'বাংলাদেশে সরকারি হাসপাতালে বিনামূল্যে চিকিৎসা পাওয়া যায়',
        'দ্রুত পরীক্ষা ও চিকিৎসা শুরু করলে ভালো ফল পাওয়া যায়',
      ],
      imageSrc: '/images/hiv_treatment.webp',
      imageAlt: 'এইচআইভি চিকিৎসা',
      reverse: true,
      accentColor: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      icon: '💊',
    },
    {
      title: 'বাংলাদেশে এইচআইভি পরিস্থিতি',
      description: 'বাংলাদেশে এইচআইভি সংক্রমণের হার তুলনামূলকভাবে কম হলেও সাম্প্রতিক বছরগুলোতে নতুন সংক্রমণের সংখ্যা বাড়ছে। সচেতনতার অভাব এবং পর্যাপ্ত পরীক্ষা না হওয়ার কারণে অনেক ক্ষেত্রে সংক্রমণ দেরিতে ধরা পড়ে।',
      bullets: [
        'সাম্প্রতিক বছরগুলোতে সংক্রমণের সংখ্যা বৃদ্ধি পাচ্ছে',
        'অনেক মানুষ এখনো পরীক্ষা করায় না',
        'কিছু ঝুঁকিপূর্ণ জনগোষ্ঠীর মধ্যে সংক্রমণের হার বেশি',
        'সচেতনতা ও দ্রুত পরীক্ষা সংক্রমণ কমাতে সাহায্য করে',
      ],
      imageSrc: '/images/hiv_cases_in_bangladesh.webp',
      imageAlt: 'বাংলাদেশে এইচআইভি পরিস্থিতি',
      reverse: false,
      accentColor: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      icon: '🗺️',
    },
    {
      title: 'প্রতিরোধ',
      description: 'এইচআইভি প্রতিরোধের সবচেয়ে কার্যকর উপায় হলো সচেতনতা এবং নিরাপদ আচরণ। কিছু সহজ পদক্ষেপ অনুসরণ করলে এই ভাইরাসের সংক্রমণ ঝুঁকি অনেকটাই কমানো সম্ভব।',
      bullets: [
        'নিরাপদ যৌন আচরণ এবং কনডম ব্যবহার',
        'রক্ত নেওয়ার আগে তা নিরাপদ কিনা নিশ্চিত করা',
        'ব্যবহৃত সুচ বা সিরিঞ্জ অন্যের সাথে ভাগ না করা',
        'নিয়মিত এইচআইভি পরীক্ষা করা',
        'গর্ভবতী নারীদের পরীক্ষা করানো নিশ্চিত করা',
        'প্রয়োজনে PrEP বা PEP ব্যবহার করা',
      ],
      imageSrc: '/images/hiv_prtection.png',
      imageAlt: 'এইচআইভি প্রতিরোধ',
      reverse: true,
      accentColor: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      icon: '🛡️',
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white min-h-screen w-full">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/background1.png" alt="background" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.3)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center px-6 pt-28 md:pt-40 pb-16 space-y-8 w-full max-w-5xl mx-auto">
          <div className="inline-block">
            <div className="relative w-28 h-28 mx-auto mb-6 drop-shadow-2xl">
              <Image src="/images/icon.png" alt="ZeroTransmit Icon" fill className="object-contain" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                ZeroTransmit
              </span>
            </h1>
          </div>

          <p className="text-2xl md:text-3xl font-semibold text-teal-100 max-w-3xl mx-auto mb-6 leading-relaxed">
            এইচআইভি সংক্রমণ প্রতিরোধ, সচেতনতা ও চিকিৎসা সহায়তার জন্য<br />
            <span className="text-white">সমন্বিত ডিজিটাল প্ল্যাটফর্ম</span>
          </p>

          <p className="text-lg md:text-xl text-teal-200/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            আধুনিক প্রযুক্তি ও কৃত্রিম বুদ্ধিমত্তা ব্যবহার করে মানুষের ঝুঁকি নির্ণয়, তথ্য প্রদান এবং
            স্বাস্থ্যসেবার সাথে সংযোগ স্থাপন করুন।
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link href="/risk-engine">
              <button className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300">
                বিনামূল্যে ঝুঁকি মূল্যায়ন করুন →
              </button>
            </Link>
            <Link href="/chatbot">
              <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300">
                চ্যাটবটে কথা বলুন 💬
              </button>
            </Link>
          </div>
        </div>

        {/* Ultra-slow canvas wave — sits below hero text */}
        <WaveBackground />
      </section>

      {/* ── ALIGNED VERTICAL FEATURES ── */}
      <section className="w-full max-w-[1400px] mx-auto py-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            return (
              <Link key={feature.href} href={feature.href} className="block h-full">
                <Card className="h-full w-full hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-gray-200 p-8 flex flex-col items-center text-center gap-6">
                  <div className={`w-32 h-32 flex-shrink-0 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <span className="text-6xl">{feature.emoji}</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-3xl font-bold mb-4 tracking-tight text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-xl leading-relaxed flex-1">{feature.description}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">আমাদের প্ল্যাটফর্মের প্রভাব</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-default">
            <div className="text-5xl font-bold mb-3">১৫০+</div>
            <div className="text-lg font-medium text-teal-50">জ্ঞানভান্ডার প্রশ্নোত্তর</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-default">
            <div className="text-5xl font-bold mb-3">১০০০+</div>
            <div className="text-lg font-medium text-teal-50">বিশ্লেষিত কেস</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-default">
            <div className="text-5xl font-bold mb-3">২৪/৭</div>
            <div className="text-lg font-medium text-teal-50">AI সহায়তা উপলব্ধ</div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED INFO SECTIONS ── */}
      <section className="w-full flex flex-col">
        <div className="text-center mb-10 mt-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            তথ্য ও সচেতনতা
          </span>
          <h2 className="text-4xl font-extrabold text-gray-800">এইচআইভি সম্পর্কে জানুন</h2>
        </div>

        <div className="w-full flex flex-col">
          {sections.map((sec, i) => (
            <AnimatedSection
              key={i}
              title={sec.title}
              description={sec.description}
              bullets={sec.bullets}
              imageSrc={sec.imageSrc}
              imageAlt={sec.imageAlt}
              reverse={sec.reverse}
              accentColor={sec.accentColor}
              bgColor={sec.bgColor}
              icon={sec.icon}
            />
          ))}
        </div>
      </section>

      {/* ── INFO SECTION / HELPLINE ── */}
      <section className="text-center space-y-6 pb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">এখনই সাহায্য দরকার?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-default">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-semibold text-teal-900 text-lg">১০০% গোপনীয়</p>
            <p className="text-teal-700 text-sm mt-2">সকল সেবা সম্পূর্ণ বেনামী</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-default">
            <div className="text-4xl mb-3">📞</div>
            <p className="font-semibold text-blue-900 text-lg">এইডস হেল্পলাইন</p>
            <p className="text-blue-700 text-2xl font-bold mt-2">16230</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-default">
            <div className="text-4xl mb-3">🆘</div>
            <p className="font-semibold text-red-900 text-lg">সংকট সহায়তা</p>
            <p className="text-red-700 text-2xl font-bold mt-2">16789</p>
            <p className="text-red-600 text-sm mt-1">(কান পেতে রই)</p>
          </div>
        </div>
      </section>

    </div>
  );
}
