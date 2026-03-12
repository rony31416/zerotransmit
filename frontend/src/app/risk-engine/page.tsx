'use client';

import { useMemo, useState } from 'react';
import { riskEngineAPI, type RiskInput, type RiskResult } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

type Option = { value: string; label: string; score?: string };

const AGE_OPTIONS: Option[] = [
  { value: '15-19', label: '১৫–১৯ বছর', score: '+5' },
  { value: '20-29', label: '২০–২৯ বছর', score: '+8' },
  { value: '30-39', label: '৩০–৩৯ বছর', score: '+5' },
  { value: '40-49', label: '৪০–৪৯ বছর', score: '+3' },
  { value: '50+', label: '৫০+ বছর', score: '+1' },
];

const SEX_OPTIONS: Option[] = [
  { value: 'male', label: 'পুরুষ', score: '+0' },
  { value: 'female', label: 'নারী', score: '+3' },
  { value: 'intersex', label: 'ইন্টারসেক্স', score: '+5' },
];

const GENDER_OPTIONS: Option[] = [
  { value: 'cis_man', label: 'সিসজেন্ডার পুরুষ', score: '+0' },
  { value: 'cis_woman', label: 'সিসজেন্ডার নারী', score: '+3' },
  { value: 'trans_woman', label: 'ট্রান্সজেন্ডার নারী', score: '+15' },
  { value: 'trans_man', label: 'ট্রান্সজেন্ডার পুরুষ', score: '+8' },
  { value: 'nonbinary', label: 'নন-বাইনারি', score: '+5' },
];

const DIVISION_OPTIONS: Option[] = [
  { value: 'Dhaka', label: 'ঢাকা', score: '+9' },
  { value: 'Chattogram', label: 'চট্টগ্রাম', score: '+7' },
  { value: 'Coxs_Bazar', label: 'কক্সবাজার', score: '+9' },
  { value: 'Sylhet', label: 'সিলেট', score: '+5' },
  { value: 'Khulna', label: 'খুলনা', score: '+5' },
  { value: 'Barishal', label: 'বরিশাল', score: '+3' },
  { value: 'Mymensingh', label: 'ময়মনসিংহ', score: '+4' },
  { value: 'Rangpur', label: 'রংপুর', score: '+3' },
];

const KEY_POP_OPTIONS: Option[] = [
  { value: 'msm', label: 'MSM (পুরুষে পুরুষে যৌন সম্পর্ক)', score: '+25' },
  { value: 'fsw', label: 'FSW (নারী যৌনকর্মী)', score: '+20' },
  { value: 'pwid', label: 'PWID (ইনজেকশন ড্রাগ ব্যবহারকারী)', score: '+22' },
  { value: 'rohingya', label: 'রোহিঙ্গা কমিউনিটির সদস্য', score: '+18' },
  { value: 'migrant', label: 'প্রবাস থেকে ফেরা শ্রমিক', score: '+12' },
  { value: 'client', label: 'যৌনকর্মীর ক্লায়েন্ট', score: '+10' },
  { value: 'prison', label: 'কারাবাস/ডিটেনশন ইতিহাস', score: '+8' },
];

const PARTNER_OPTIONS: Option[] = [
  { value: '0', label: '০ জন', score: '+0' },
  { value: '1', label: '১ জন', score: '+2' },
  { value: '2-3', label: '২–৩ জন', score: '+8' },
  { value: '4-6', label: '৪–৬ জন', score: '+15' },
  { value: '7+', label: '৭+ জন', score: '+20' },
];

const SEXUAL_CONTACT_OPTIONS: Option[] = [
  { value: 'vaginal_receptive', label: 'ভ্যাজাইনাল (রিসেপটিভ)', score: '+8' },
  { value: 'vaginal_insertive', label: 'ভ্যাজাইনাল (ইনসার্টিভ)', score: '+5' },
  { value: 'anal_receptive', label: 'এনাল (রিসেপটিভ)', score: '+20' },
  { value: 'anal_insertive', label: 'এনাল (ইনসার্টিভ)', score: '+12' },
  { value: 'oral', label: 'শুধু ওরাল', score: '+1' },
];

const STI_SYMPTOM_OPTIONS: Option[] = [
  { value: 'sores', label: 'যৌনাঙ্গে ঘা/আলসার', score: '+15' },
  { value: 'discharge', label: 'অস্বাভাবিক স্রাব', score: '+10' },
  { value: 'painful_urination', label: 'প্রস্রাবে জ্বালাপোড়া', score: '+8' },
  { value: 'rash', label: 'শরীরে র‍্যাশ', score: '+5' },
];

const CONDOM_OPTIONS: Option[] = [
  { value: 'always', label: 'সবসময়', score: '+0' },
  { value: 'most', label: 'বেশিরভাগ সময়', score: '+8' },
  { value: 'sometimes', label: 'কখনও কখনও', score: '+15' },
  { value: 'rarely', label: 'খুব কম', score: '+20' },
  { value: 'never', label: 'কখনও না', score: '+25' },
];

const YES_NO = {
  condomLast: [
    { value: 'yes', label: 'হ্যাঁ (শেষবার কনডম ব্যবহার করেছি)', score: '+0' },
    { value: 'no', label: 'না', score: '+10' },
  ],
  transactional: [
    { value: 'no', label: 'না', score: '+0' },
    { value: 'yes', label: 'হ্যাঁ', score: '+20' },
  ],
};

function getRiskStyle(level: string) {
  switch (level) {
    case 'Low':
      return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300', label: 'নিম্ন ঝুঁকি' };
    case 'Medium':
      return { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300', label: 'মাঝারি ঝুঁকি' };
    case 'High':
      return { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300', label: 'উচ্চ ঝুঁকি' };
    case 'Very High':
      return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', label: 'অত্যন্ত উচ্চ ঝুঁকি' };
    default:
      return { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300', label: 'বিশেষ পরামর্শ প্রয়োজন' };
  }
}

export default function RiskEnginePage() {
  const [formData, setFormData] = useState<RiskInput>({
    age_group: '20-29',
    sex: 'male',
    gender_identity: 'cis_man',
    division: 'Dhaka',
    key_populations: [],
    num_partners: '1',
    sexual_contact: [],
    condom_consistency: 'always',
    condom_last: 'yes',
    sex_under_influence: 'never',
    transactional_sex: 'no',
    sti_history: 'no',
    sti_symptoms: [],
    hiv_test_history: 'never',
    on_prep: 'no_aware',
    blood_transfusion: 'no',
    needle_sharing: 'no',
    voluntary_testing: 'occasional',
    partner_status: 'unknown',
    hiv_awareness: 'moderate',
  });

  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof RiskInput>(key: K, value: RiskInput[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMulti = (key: 'key_populations' | 'sexual_contact' | 'sti_symptoms', value: string) => {
    setFormData((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await riskEngineAPI.predictRisk(formData);
      setResult(data);
    } catch (err) {
      setError('ঝুঁকি বিশ্লেষণ করা যায়নি। আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const riskStyle = useMemo(() => getRiskStyle(result?.risk_level ?? ''), [result?.risk_level]);

  const selectClass = 'w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4 pt-8">
        <div className="text-6xl">🛡️</div>
        <h1 className="text-5xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          এইচআইভি ঝুঁকি মূল্যায়ন
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          WHO, UNAIDS, CDC এবং বাংলাদেশ NASP নির্দেশিকা অনুযায়ী ২০-প্রশ্নভিত্তিক গোপনীয় স্ক্রিনিং টুল
        </p>
        <div className="inline-flex items-center gap-2 bg-teal-50 border-2 border-teal-200 px-6 py-3 rounded-full">
          <span className="text-2xl">🔒</span>
          <span className="text-teal-800 font-semibold">সম্পূর্ণ গোপনীয় এবং ব্যক্তিগত তথ্য সংরক্ষণ করা হয় না</span>
        </div>
      </div>

      <Card className="border-2 border-gray-200 shadow-xl bg-white/95 backdrop-blur">
        <CardHeader className="bg-linear-to-r from-teal-50 to-emerald-50 border-b-2 border-gray-200">
          <CardTitle className="text-2xl text-gray-900">স্ট্যান্ডার্ডাইজড রিস্ক প্রশ্নমালা (২০ প্রশ্ন)</CardTitle>
          <p className="text-sm text-gray-700 mt-1">সঠিক ফলাফলের জন্য সততার সাথে উত্তর দিন</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">ধাপ ১: ডেমোগ্রাফিক তথ্য</h2>

              <div>
                <label className="block font-semibold text-gray-800 mb-2">১) বয়সের গ্রুপ</label>
                <select className={selectClass} value={formData.age_group} onChange={(e) => updateField('age_group', e.target.value as RiskInput['age_group'])}>
                  {AGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">২) জন্মগত লিঙ্গ</label>
                  <select className={selectClass} value={formData.sex} onChange={(e) => updateField('sex', e.target.value as RiskInput['sex'])}>
                    {SEX_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">৩) জেন্ডার আইডেন্টিটি</label>
                  <select className={selectClass} value={formData.gender_identity} onChange={(e) => updateField('gender_identity', e.target.value as RiskInput['gender_identity'])}>
                    {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-2">৪) আপনার বিভাগ</label>
                <select className={selectClass} value={formData.division} onChange={(e) => updateField('division', e.target.value)}>
                  {DIVISION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                </select>
              </div>
            </section>

            <section className="space-y-5 border-t-2 border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900">ধাপ ২: কী পপুলেশন স্ট্যাটাস</h2>
              <p className="text-sm text-gray-700">৫) প্রযোজ্য হলে সবগুলো নির্বাচন করুন</p>
              <div className="grid md:grid-cols-2 gap-3">
                {KEY_POP_OPTIONS.map((o) => {
                  const checked = formData.key_populations.includes(o.value);
                  return (
                    <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${checked ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-300'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleMulti('key_populations', o.value)} className="w-4 h-4" />
                      <span className="text-gray-900 text-sm font-medium">{o.label} ({o.score})</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="space-y-5 border-t-2 border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900">ধাপ ৩: যৌন আচরণ</h2>

              <div>
                <label className="block font-semibold text-gray-800 mb-2">৬) গত ১২ মাসে যৌন সঙ্গীর সংখ্যা</label>
                <select className={selectClass} value={formData.num_partners} onChange={(e) => updateField('num_partners', e.target.value as RiskInput['num_partners'])}>
                  {PARTNER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-2">৭) যৌন সম্পর্কের ধরন (প্রযোজ্য সব নির্বাচন করুন)</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {SEXUAL_CONTACT_OPTIONS.map((o) => {
                    const checked = formData.sexual_contact.includes(o.value);
                    return (
                      <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${checked ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-300'}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleMulti('sexual_contact', o.value)} className="w-4 h-4" />
                        <span className="text-gray-900 text-sm font-medium">{o.label} ({o.score})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">৮) কনডম ব্যবহারের ধারাবাহিকতা</label>
                  <select className={selectClass} value={formData.condom_consistency} onChange={(e) => updateField('condom_consistency', e.target.value as RiskInput['condom_consistency'])}>
                    {CONDOM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">৯) শেষ যৌন সম্পর্কে কনডম ব্যবহার করেছেন?</label>
                  <select className={selectClass} value={formData.condom_last} onChange={(e) => updateField('condom_last', e.target.value as RiskInput['condom_last'])}>
                    {YES_NO.condomLast.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১০) মাদক/অ্যালকোহলের প্রভাবে যৌন সম্পর্ক</label>
                  <select className={selectClass} value={formData.sex_under_influence} onChange={(e) => updateField('sex_under_influence', e.target.value as RiskInput['sex_under_influence'])}>
                    <option value="never">কখনও না (+0)</option>
                    <option value="sometimes">কখনও কখনও (+8)</option>
                    <option value="frequently">ঘন ঘন (+15)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১১) অর্থ/উপহার/আশ্রয়ের বিনিময়ে যৌন সম্পর্ক</label>
                  <select className={selectClass} value={formData.transactional_sex} onChange={(e) => updateField('transactional_sex', e.target.value as RiskInput['transactional_sex'])}>
                    {YES_NO.transactional.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.score})</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-5 border-t-2 border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900">ধাপ ৪: STI ও মেডিক্যাল ইতিহাস</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১২) STI ইতিহাস</label>
                  <select className={selectClass} value={formData.sti_history} onChange={(e) => updateField('sti_history', e.target.value as RiskInput['sti_history'])}>
                    <option value="no">না (+0)</option>
                    <option value="treated">হ্যাঁ, চিকিৎসা হয়েছে (+10)</option>
                    <option value="untreated">হ্যাঁ, এখনও চিকিৎসা হয়নি (+20)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৩) STI লক্ষণ (প্রযোজ্য হলে নির্বাচন করুন)</label>
                  <div className="space-y-2">
                    {STI_SYMPTOM_OPTIONS.map((o) => {
                      const checked = formData.sti_symptoms.includes(o.value);
                      return (
                        <label key={o.value} className={`flex items-center gap-2 p-2 rounded-lg border ${checked ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-300'}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleMulti('sti_symptoms', o.value)} className="w-4 h-4" />
                          <span className="text-sm text-gray-900">{o.label} ({o.score})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৪) HIV টেস্টিং ইতিহাস</label>
                  <select className={selectClass} value={formData.hiv_test_history} onChange={(e) => updateField('hiv_test_history', e.target.value as RiskInput['hiv_test_history'])}>
                    <option value="never">কখনও টেস্ট করিনি (+10)</option>
                    <option value="recent_negative">গত ৩ মাসে নেগেটিভ (+0)</option>
                    <option value="old_negative">১ বছরের বেশি আগে নেগেটিভ (+8)</option>
                    <option value="positive">পজিটিভ (বিশেষ কাউন্সেলিং রুট)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৫) PrEP ব্যবহার</label>
                  <select className={selectClass} value={formData.on_prep} onChange={(e) => updateField('on_prep', e.target.value as RiskInput['on_prep'])}>
                    <option value="yes_consistent">হ্যাঁ, নিয়মিত (-15)</option>
                    <option value="yes_inconsistent">হ্যাঁ, অনিয়মিত (-5)</option>
                    <option value="no_unaware">না, PrEP সম্পর্কে জানি না (+5)</option>
                    <option value="no_aware">না, জানি কিন্তু নেই (+0)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৬) গত ২ বছরে রক্ত সঞ্চালন/সার্জারি</label>
                  <select className={selectClass} value={formData.blood_transfusion} onChange={(e) => updateField('blood_transfusion', e.target.value as RiskInput['blood_transfusion'])}>
                    <option value="no">না (+0)</option>
                    <option value="verified">হ্যাঁ, যাচাইকৃত (+3)</option>
                    <option value="unverified">হ্যাঁ, যাচাই ছাড়া (+12)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৭) সুচ/সিরিঞ্জ শেয়ার করেন?</label>
                  <select className={selectClass} value={formData.needle_sharing} onChange={(e) => updateField('needle_sharing', e.target.value as RiskInput['needle_sharing'])}>
                    <option value="no">না (+0)</option>
                    <option value="sometimes">কখনও কখনও (+20)</option>
                    <option value="regularly">নিয়মিত (+30)</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-5 border-t-2 border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900">ধাপ ৫: সামাজিক ও সচেতনতা প্রসঙ্গ</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৮) স্বেচ্ছায় HIV টেস্ট করার অভ্যাস</label>
                  <select className={selectClass} value={formData.voluntary_testing} onChange={(e) => updateField('voluntary_testing', e.target.value as RiskInput['voluntary_testing'])}>
                    <option value="regular">নিয়মিত (৩–৬ মাসে) (-5)</option>
                    <option value="occasional">১-২ বার করেছি (+0)</option>
                    <option value="afraid">ভয়ে করিনি (+8)</option>
                    <option value="dont_know">কোথায় করব জানি না (+5)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">১৯) সঙ্গীর HIV স্ট্যাটাস জানেন?</label>
                  <select className={selectClass} value={formData.partner_status} onChange={(e) => updateField('partner_status', e.target.value as RiskInput['partner_status'])}>
                    <option value="both_tested">হ্যাঁ, দুজনেই সাম্প্রতিক টেস্ট করেছি (-5)</option>
                    <option value="not_recent">হ্যাঁ, তবে সাম্প্রতিক না (+5)</option>
                    <option value="unknown">জানি না (+10)</option>
                    <option value="no_partner">নিয়মিত সঙ্গী নেই (+0)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-2">২০) HIV সম্পর্কে জ্ঞান</label>
                  <select className={selectClass} value={formData.hiv_awareness} onChange={(e) => updateField('hiv_awareness', e.target.value as RiskInput['hiv_awareness'])}>
                    <option value="high">উচ্চ (-5)</option>
                    <option value="moderate">মধ্যম (+0)</option>
                    <option value="low">কম (+8)</option>
                    <option value="very_low">খুব কম/ভুল ধারণা (+12)</option>
                  </select>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-xl hover:from-teal-700 hover:to-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'বিশ্লেষণ চলছে...' : 'ঝুঁকি স্কোর হিসাব করুন'}
            </button>

            {error && <p className="text-red-700 font-semibold">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className={`border-2 ${riskStyle.border} shadow-2xl`}>
          <CardHeader className={`${riskStyle.bg} border-b-2 ${riskStyle.border}`}>
            <CardTitle className="text-2xl text-gray-900">বিশ্লেষণের ফলাফল</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {result.risk_score === null ? (
              <div className="space-y-3">
                <p className="text-2xl font-bold text-purple-700">{result.risk_level}</p>
                <p className="text-gray-800">{result.message}</p>
                {result.art_helpline && (
                  <p className="font-semibold text-teal-700">ART হেল্পলাইন: {result.art_helpline}</p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className={`text-6xl font-extrabold ${riskStyle.color}`}>{result.risk_score}</p>
                <p className={`text-2xl font-bold ${riskStyle.color}`}>{riskStyle.label}</p>
                {result.urgent && <p className="text-red-700 font-bold">জরুরি পদক্ষেপ প্রয়োজন</p>}
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">ব্যক্তিগত পরামর্শ</h3>
              <ul className="space-y-2 text-gray-800">
                {(result.recommendations || []).map((item, idx) => (
                  <li key={`${idx}-${item}`} className="leading-relaxed">• {item}</li>
                ))}
              </ul>
            </div>

            {result.disclaimer && (
              <p className="text-sm text-gray-700">{result.disclaimer}</p>
            )}

            <p className="text-gray-800 font-medium">সহায়তা প্রয়োজন হলে AIDS হেল্পলাইন: <span className="text-teal-700 font-bold">১৬২৩০</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
