'use client';

import { useState, useRef, useEffect } from 'react';
import { counselingAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

interface Message {
  role: 'user' | 'counselor';
  content: string;
  mood?: 'positive' | 'distressed' | 'crisis';
  timestamp: Date;
}

export default function CounselingPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'counselor',
      content: 'হ্যালো, আমি আপনাকে মানসিক সহায়তা এবং নির্দেশনা দিতে এখানে আছি। আপনি আজকে কেমন বোধ করছেন?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useRef(`user-${Math.random().toString(36).slice(2)}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await counselingAPI.getAdherenceTips();
      setTips(response.tips);
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await counselingAPI.sendMessage(input, userId.current);
      const counselorMessage: Message = {
        role: 'counselor',
        content: response.response,
        mood: response.mood,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, counselorMessage]);

      if (response.escalate_to_human) {
        const escalationMessage: Message = {
          role: 'counselor',
          content: response.mood === 'crisis' 
            ? '⚠️ খুব জরুরি: অনুগ্রহ করে এখনই 16789 নম্বরে কল করুন। একজন কল রিসিভ করবেন।'
            : 'আপনি কি একজন মানুষের সাথে কথা বলতে চান? তারা আপনাকে আরও ভালোভাবে সাহায্য করতে পারবে।',
          mood: response.mood,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, escalationMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'counselor',
        content: 'আমি আপনার সাথে আছি। অনুগ্রহ করে আবার চেষ্টা করুন বা 16789 নম্বরে কল করুন।',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      <div className="text-center space-y-4 pt-8">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          মানসিক স্বাস্থ্য কাউন্সেলিং
        </h1>
        <p className="text-xl text-gray-600">আবেগজনিত সুস্থতার জন্য সমর্থন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 h-[650px] flex flex-col border-2 border-gray-200 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b-2 border-gray-200">
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
              <span className="text-3xl">💜</span>
              কাউন্সেলিং সেশন
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">গোপনীয় মানসিক সহায়তা</p>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl shadow-md ${
                  msg.role === 'user' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-violet-500 to-purple-500'
                }`}>
                  {msg.role === 'user' ? '👤' : '💜'}
                </div>
                <div
                  className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : msg.mood === 'crisis'
                      ? 'bg-red-50 border-3 border-red-400 text-gray-800'
                      : msg.mood === 'distressed'
                      ? 'bg-yellow-50 border-3 border-yellow-400 text-gray-800'
                      : 'bg-white text-gray-800 border-2 border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-2xl shadow-md">
                  💜
                </div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-2xl shadow-md">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t-2 border-gray-200 p-6 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="আপনার অনুভূতি শেয়ার করুন..."
                className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-lg"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all disabled:opacity-50 shadow-lg font-semibold"
              >
                <span className="text-2xl">📤</span>
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-purple-900">💊 ওষুধ খাওয়ার টিপস</CardTitle>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {showTips ? 'লুকান' : 'দেখান'}
                </button>
              </div>
            </CardHeader>
            {showTips && (
              <CardContent>
                <ul className="space-y-3 text-sm text-purple-800">
                  {tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-lg">✅</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>

          <Card className="bg-red-50 border-2 border-red-300 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                <span className="text-2xl">🆘</span>
                জরুরী সহায়তা
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-red-800">
                <p className="font-bold text-lg">যদি আপনি খুব কষ্টে থাকেন:</p>
                <div className="bg-white border-2 border-red-200 p-4 rounded-xl">
                  <p className="font-bold text-2xl text-red-600 mb-1">16789</p>
                  <p className="text-red-700">(কান পেতে রই)</p>
                </div>
                <p className="font-semibold">🚨 24/7 প্রফেশনাল সাপোর্ট</p>
                <p className="italic">আপনি একা নন। সাহায্য সবসময় আছে।</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle className="text-lg text-teal-900">📚 প্রয়োজনীয় তথ্য</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-teal-800">
                <p className="flex items-center gap-2">
                  <span className="text-xl">🏥</span>
                  সব সরকারি হাসপাতালে বিনামূল্যে চিকিৎসা (ART)
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xl">🤝</span>
                  সাপোর্ট গ্রুপ
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  বাংলায় শিক্ষামূলক উপাদান
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center bg-gradient-to-r from-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl p-6">
        <p className="text-purple-900 font-semibold flex items-center justify-center gap-2">
          <span className="text-2xl">🔒</span>
          সমস্ত কথোপকথন সম্পূর্ণ গোপনীয় এবং সুরক্ষিত
        </p>
      </div>
    </div>
  );
}
