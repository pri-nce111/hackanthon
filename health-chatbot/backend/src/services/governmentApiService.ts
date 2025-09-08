import axios from 'axios';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface VaccinationCenter {
  center_id: number;
  name: string;
  address: string;
  state_name: string;
  district_name: string;
  block_name: string;
  pincode: number;
  lat: number;
  long: number;
  from: string;
  to: string;
  fee_type: 'Free' | 'Paid';
  sessions: VaccinationSession[];
}

export interface VaccinationSession {
  session_id: string;
  date: string;
  available_capacity: number;
  min_age_limit: number;
  vaccine: string;
  slots: string[];
}

export interface HealthAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  state?: string;
  district?: string;
  date: string;
  source: string;
}

export interface CovidStats {
  country: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  updated: number;
}

export class GovernmentApiService {
  private cowinBaseUrl: string;
  private diseaseApiUrl: string;

  constructor() {
    this.cowinBaseUrl = config.cowinApiUrl;
    this.diseaseApiUrl = config.diseaseApiUrl;
  }

  /**
   * Get vaccination centers by pincode
   */
  async getVaccinationCentersByPincode(pincode: string, date: string): Promise<VaccinationCenter[]> {
    try {
      const response = await axios.get(
        `${this.cowinBaseUrl}/v2/appointment/sessions/public/calendarByPin`,
        {
          params: {
            pincode,
            date
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      return response.data.centers || [];
    } catch (error) {
      logger.error('Error fetching vaccination centers by pincode:', error);
      return [];
    }
  }

  /**
   * Get vaccination centers by district
   */
  async getVaccinationCentersByDistrict(districtId: string, date: string): Promise<VaccinationCenter[]> {
    try {
      const response = await axios.get(
        `${this.cowinBaseUrl}/v2/appointment/sessions/public/calendarByDistrict`,
        {
          params: {
            district_id: districtId,
            date
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      return response.data.centers || [];
    } catch (error) {
      logger.error('Error fetching vaccination centers by district:', error);
      return [];
    }
  }

  /**
   * Get all states
   */
  async getStates(): Promise<{ state_id: number; state_name: string }[]> {
    try {
      const response = await axios.get(`${this.cowinBaseUrl}/v2/admin/location/states`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return response.data.states || [];
    } catch (error) {
      logger.error('Error fetching states:', error);
      return [];
    }
  }

  /**
   * Get districts by state
   */
  async getDistrictsByState(stateId: string): Promise<{ district_id: number; district_name: string }[]> {
    try {
      const response = await axios.get(
        `${this.cowinBaseUrl}/v2/admin/location/districts/${stateId}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      return response.data.districts || [];
    } catch (error) {
      logger.error('Error fetching districts:', error);
      return [];
    }
  }

  /**
   * Get COVID-19 statistics for India
   */
  async getCovidStats(): Promise<CovidStats | null> {
    try {
      const response = await axios.get(`${this.diseaseApiUrl}/countries/India`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching COVID stats:', error);
      return null;
    }
  }

  /**
   * Get vaccination schedule information
   */
  getVaccinationSchedule(language: 'en' | 'hi' = 'en'): string {
    if (language === 'hi') {
      return `**टीकाकरण कार्यक्रम:**

**शिशु (0-2 वर्ष):**
• जन्म: बीसीजी, हेपेटाइटिस बी, ओपीवी
• 6 सप्ताह: डीपीटी-1, आईपीवी-1, हेपेटाइटिस बी-2, हिब-1, रोटावायरस-1, पीसीवी-1
• 10 सप्ताह: डीपीटी-2, आईपीवी-2, हिब-2, रोटावायरस-2, पीसीवी-2
• 14 सप्ताह: डीपीटी-3, आईपीवी-3, हिब-3, रोटावायरस-3, पीसीवी-3
• 9 महीने: खसरा-1, जेई-1 (स्थानिक क्षेत्रों में)
• 16-24 महीने: डीपीटी बूस्टर, आईपीवी बूस्टर, खसरा-2, जेई-2

**वयस्क:**
• टिटनेस: हर 10 साल में
• इन्फ्लूएंजा: वार्षिक (60+ आयु के लिए अनुशंसित)
• कोविड-19: वर्तमान दिशानिर्देशों के अनुसार

अधिक जानकारी के लिए अपने नजदीकी स्वास्थ्य केंद्र से संपर्क करें।`;
    }

    return `**Vaccination Schedule:**

**Infants (0-2 years):**
• Birth: BCG, Hepatitis B, OPV
• 6 weeks: DPT-1, IPV-1, Hepatitis B-2, Hib-1, Rotavirus-1, PCV-1
• 10 weeks: DPT-2, IPV-2, Hib-2, Rotavirus-2, PCV-2
• 14 weeks: DPT-3, IPV-3, Hib-3, Rotavirus-3, PCV-3
• 9 months: Measles-1, JE-1 (in endemic areas)
• 16-24 months: DPT booster, IPV booster, Measles-2, JE-2

**Adults:**
• Tetanus: Every 10 years
• Influenza: Annual (recommended for 60+ age)
• COVID-19: As per current guidelines

Contact your nearest health center for more information.`;
  }

  /**
   * Format vaccination center information for chat response
   */
  formatVaccinationCenters(centers: VaccinationCenter[], language: 'en' | 'hi' = 'en'): string {
    if (centers.length === 0) {
      return language === 'hi' 
        ? 'आपके क्षेत्र में वर्तमान में कोई टीकाकरण केंद्र उपलब्ध नहीं है।'
        : 'No vaccination centers are currently available in your area.';
    }

    const header = language === 'hi' 
      ? '**आपके क्षेत्र में टीकाकरण केंद्र:**\n\n'
      : '**Vaccination Centers in Your Area:**\n\n';

    let result = header;

    centers.slice(0, 5).forEach((center, index) => {
      const availableSessions = center.sessions.filter(session => session.available_capacity > 0);
      
      if (availableSessions.length > 0) {
        result += `**${index + 1}. ${center.name}**\n`;
        result += language === 'hi' 
          ? `📍 पता: ${center.address}\n`
          : `📍 Address: ${center.address}\n`;
        result += language === 'hi' 
          ? `💰 शुल्क: ${center.fee_type === 'Free' ? 'मुफ्त' : 'पेड'}\n`
          : `💰 Fee: ${center.fee_type}\n`;

        availableSessions.forEach(session => {
          result += language === 'hi'
            ? `📅 दिनांक: ${session.date} | उपलब्ध: ${session.available_capacity} | वैक्सीन: ${session.vaccine}\n`
            : `📅 Date: ${session.date} | Available: ${session.available_capacity} | Vaccine: ${session.vaccine}\n`;
        });
        result += '\n';
      }
    });

    return result;
  }

  /**
   * Mock function for health alerts (replace with actual government API when available)
   */
  async getHealthAlerts(state?: string, district?: string): Promise<HealthAlert[]> {
    // Mock data - replace with actual API call when available
    const mockAlerts: HealthAlert[] = [
      {
        id: '1',
        title: 'Dengue Alert',
        description: 'Increased dengue cases reported in the region. Take preventive measures.',
        severity: 'medium',
        state: state || 'Delhi',
        district: district,
        date: new Date().toISOString().split('T')[0],
        source: 'Ministry of Health & Family Welfare'
      }
    ];

    return mockAlerts;
  }
}