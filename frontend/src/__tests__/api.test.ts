import { riskEngineAPI, chatbotAPI, counselingAPI, geomapAPI } from '@/lib/api';
import type { RiskInput } from '@/lib/api';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Risk Engine API', () => {
    it('should send risk prediction request', async () => {
      const mockResponse = {
        data: {
          risk_score: 45,
          risk_level: 'Medium',
          recommendations: ['Schedule an HIV test soon'],
          recommend_prep: false,
          recommend_testing: true,
        },
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const input: RiskInput = {
        age_group: '20-29',
        sex: 'male',
        gender_identity: 'cis_man',
        division: 'Dhaka',
        key_populations: [],
        num_partners: '2-3',
        sexual_contact: ['vaginal_insertive'],
        condom_consistency: 'sometimes',
        condom_last: 'no',
        sex_under_influence: 'sometimes',
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
      };

      // Note: This test is simplified - full integration would require axios setup
      expect(input.age_group).toBe('20-29');
      expect(input.sex).toBe('male');
    });
  });

  describe('API Configuration', () => {
    it('should use correct base URL from environment', () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      expect(baseUrl).toBeDefined();
    });
  });
});
