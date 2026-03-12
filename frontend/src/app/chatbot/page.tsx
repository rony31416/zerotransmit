'use client';

import { useEffect, useRef, useState } from 'react';
import { chatbotAPI } from '@/lib/api';

type Message = {
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
  isCrisis?: boolean;
};

const QUICK_QUESTIONS = [
  { label: 'HIV কী?', text: 'HIV কী এবং কীভাবে ছড়ায়?' },
  { label: 'PrEP কী?', text: 'PrEP কী এবং কাদের জন্য দরকার?' },
  { label: 'টেস্ট কোথায়?', text: 'বাংলাদেশে বিনামূল্যে HIV টেস্ট কোথায় করানো যায়?' },
  { label: 'ডেঙ্গু লক্ষণ', text: 'ডেঙ্গুর প্রধান লক্ষণগুলো কী কী?' },
  { label: 'ART চিকিৎসা', text: 'ART চিকিৎসা কী এবং বাংলাদেশে ফ্রি পাওয়া যায় কি?' },
  { label: 'কনডম সুরক্ষা', text: 'কনডম ব্যবহার করলে HIV ঝুঁকি কতটা কমে?' },
];

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n').filter(Boolean);
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return (
            <p key={i} className="font-semibold text-gray-900">
              {trimmed.replace(/\*\*/g, '')}
            </p>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <p key={i} className="flex gap-2">
              <span className="text-teal-600 mt-0.5">•</span>
              <span>{trimmed.slice(2)}</span>
            </p>
          );
        }
        if (/^\d+\./.test(trimmed)) {
          return (
            <p key={i} className="flex gap-2">
              <span className="text-teal-700 font-bold">{trimmed.match(/^\d+/)?.[0]}.</span>
              <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
            </p>
          );
        }
        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'আসসালামু আলাইকুম। আমি ZeroTransmit স্বাস্থ্য সহায়ক। HIV, STI, ডেঙ্গু ও নিরাপদ আচরণ বিষয়ে আপনার প্রশ্নের উত্তর বাংলায় দিতে পারি।',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const historyPayload = () =>
    messages
      .filter((m) => !m.isTyping)
      .map((m) => ({ role: m.role, text: m.text }));

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMessage, { role: 'model', text: '', isTyping: true }]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await chatbotAPI.chat(text.trim(), historyPayload());
      console.log(res);
      setMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          role: 'model',
          text: res.answer || 'দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না।',
          isCrisis: Boolean(res.is_crisis),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          role: 'model',
          text: 'দুঃখিত, সার্ভারে সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।',
        },
      ]);
      setError('চ্যাট সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">স্বাস্থ্য সহায়ক চ্যাট</h1>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            শুধুমাত্র HIV, STI, ডেঙ্গু, PrEP, ART এবং স্বাস্থ্যসেবা কেন্দ্র-সম্পর্কিত প্রশ্নের উত্তর দেওয়া হয়।
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.text}
                  onClick={() => sendMessage(q.text)}
                  disabled={loading}
                  className="text-xs md:text-sm bg-slate-50 border border-slate-300 text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[54vh] min-h-[420px] overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, idx) => (
              <div key={`${idx}-${m.role}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] md:max-w-[78%] rounded-2xl px-4 py-3 border ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white border-teal-700'
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                >
                  {m.isTyping ? <TypingDots /> : <FormattedText text={m.text} />}

                  {m.isCrisis && (
                    <div className="mt-3 bg-red-50 border border-red-300 rounded-lg px-3 py-2 text-xs text-red-800">
                      জরুরি সহায়তা: কান পেতে রই হেল্পলাইন 16789
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="border border-slate-300 rounded-xl bg-white focus-within:border-teal-500">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="প্রশ্ন লিখুন... (Enter = পাঠান, Shift+Enter = নতুন লাইন)"
                className="w-full px-3 pt-3 pb-1 text-sm text-slate-900 placeholder:text-slate-500 bg-transparent outline-none resize-none"
              />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <span className="text-xs text-slate-500">{input.length}/500</span>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'অপেক্ষা করুন...' : 'পাঠান'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              এই চ্যাট তথ্যভিত্তিক সহায়তা দেয়, এটি চিকিৎসকের বিকল্প নয়। জরুরি প্রয়োজনে 16230 অথবা 16789-এ কল করুন।
            </p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
