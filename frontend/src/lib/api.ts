import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Risk Engine API
export const riskEngineAPI = {
  predictRisk: async (data: RiskInput) => {
    const response = await api.post('/api/risk-engine/predict', data);
    return response.data;
  },
};

// Chatbot API
export const chatbotAPI = {
  chat: async (message: string, history: { role: string; text: string }[] = []) => {
    const response = await api.post('/api/chatbot/chat', { message, history });
    return response.data;
  },
  getClinics: async () => {
    const response = await api.get('/api/chatbot/clinics');
    return response.data;
  },
};

// Counseling API
export const counselingAPI = {
  sendMessage: async (message: string, userId: string) => {
    const response = await api.post('/api/counseling/message', { message, user_id: userId });
    return response.data;
  },
  getAdherenceTips: async () => {
    const response = await api.get('/api/counseling/adherence-tips');
    return response.data;
  },
};

// Geomap API
export const geomapAPI = {
  getCases: async () => {
    const response = await api.get('/api/geomap/cases');
    return response.data;
  },
  getHotspots: async () => {
    const response = await api.get('/api/geomap/hotspots');
    return response.data;
  },
  getForecast: async () => {
    const response = await api.get('/api/geomap/forecast');
    return response.data;
  },
};

// Types
export interface RiskInput {
  age_group: '15-19' | '20-29' | '30-39' | '40-49' | '50+';
  sex: 'male' | 'female' | 'intersex';
  gender_identity: 'cis_man' | 'cis_woman' | 'trans_woman' | 'trans_man' | 'nonbinary';
  division: string;
  key_populations: string[];
  num_partners: '0' | '1' | '2-3' | '4-6' | '7+';
  sexual_contact: string[];
  condom_consistency: 'always' | 'most' | 'sometimes' | 'rarely' | 'never';
  condom_last: 'yes' | 'no';
  sex_under_influence: 'never' | 'sometimes' | 'frequently';
  transactional_sex: 'yes' | 'no';
  sti_history: 'no' | 'treated' | 'untreated';
  sti_symptoms: string[];
  hiv_test_history: 'never' | 'recent_negative' | 'old_negative' | 'positive';
  on_prep: 'yes_consistent' | 'yes_inconsistent' | 'no_unaware' | 'no_aware';
  blood_transfusion: 'no' | 'verified' | 'unverified';
  needle_sharing: 'no' | 'sometimes' | 'regularly';
  voluntary_testing: 'regular' | 'occasional' | 'afraid' | 'dont_know';
  partner_status: 'both_tested' | 'not_recent' | 'unknown' | 'no_partner';
  hiv_awareness: 'high' | 'moderate' | 'low' | 'very_low';
}

export interface RiskResult {
  risk_score: number | null;
  risk_level: string;
  recommendations: string[];
  recommend_prep: boolean;
  recommend_testing: boolean;
  urgent?: boolean;
  standard?: string;
  disclaimer?: string;
  message?: string;
  art_helpline?: string;
}
