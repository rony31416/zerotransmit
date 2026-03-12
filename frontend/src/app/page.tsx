import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export default function Home() {
  const features = [
    {
      title: 'Risk Assessment',
      description: 'AI-powered HIV risk evaluation based on your personal factors and behaviors.',
      emoji: '🛡️',
      href: '/risk-engine',
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Chatbot Support',
      description: 'Get instant answers about HIV prevention, testing, and treatment in Bangla or English.',
      emoji: '💬',
      href: '/chatbot',
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Mental Health Counseling',
      description: 'CBT-based support for living with HIV, medication adherence, and emotional wellbeing.',
      emoji: '🧠',
      href: '/counseling',
      gradient: 'from-purple-500 to-violet-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Geographic Analytics',
      description: 'Visualize hotspots, trends, and predictions for HIV cases across Bangladesh.',
      emoji: '🗺️',
      href: '/geomap',
      gradient: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16 px-4">
        <div className="inline-block">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            ZeroTransmit
          </h1>
        </div>
        <p className="text-2xl font-semibold text-gray-800 max-w-3xl mx-auto">
          AI-Powered Platform for HIV & Dengue Prevention in Bangladesh
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Empowering communities with intelligent health monitoring, evidence-based prevention tools, and compassionate mental health support.
        </p>
        <div className="pt-4">
          <Link href="/risk-engine">
            <button className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Get Started - Free Risk Assessment
            </button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => {
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-gray-200">
                <CardHeader>
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-4xl">{feature.emoji}</span>
                  </div>
                  <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Platform Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
            <div className="text-5xl font-bold mb-3">150+</div>
            <div className="text-lg font-medium text-teal-50">Knowledge Base Q&A Pairs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
            <div className="text-5xl font-bold mb-3">1000+</div>
            <div className="text-lg font-medium text-teal-50">Anonymized Cases Tracked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
            <div className="text-5xl font-bold mb-3">24/7</div>
            <div className="text-lg font-medium text-teal-50">AI Support Available</div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="text-center space-y-6 pb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Need Immediate Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-semibold text-teal-900 text-lg">100% Confidential</p>
            <p className="text-teal-700 text-sm mt-2">All services are anonymous</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">📞</div>
            <p className="font-semibold text-blue-900 text-lg">AIDS Helpline</p>
            <p className="text-blue-700 text-2xl font-bold mt-2">16230</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">🆘</div>
            <p className="font-semibold text-red-900 text-lg">Crisis Support</p>
            <p className="text-red-700 text-2xl font-bold mt-2">16789</p>
            <p className="text-red-600 text-sm mt-1">(Kaan Pete Roi)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
