import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';
// @ts-ignore: Library doesn't have types, so we ignore strict checking for import
import { MhahPanchang } from 'mhah-panchang';

// --- TYPES ---
export interface PanchangData {
  vikramSamvat: string;
  maas: string;
  paksha: string;
  tithi: string;
  fullTithi: string;
  festival: string;
  isEkadashi: boolean;
  isPoonam: boolean;
  sunrise: string;
  sunset: string;
}

interface Coords {
  lat: number;
  lng: number;
}

// --- MAPPINGS ---
const TITHI_NAME_MAP: Record<string, string> = {
  "Pratipada": "Ekam", "Padyami": "Ekam",
  "Dwitiya": "Bij", "Vidiya": "Bij",
  "Tritiya": "Trij", "Thadiya": "Trij",
  "Chaturthi": "Choth", "Chaviti": "Choth",
  "Panchami": "Paancham",
  "Shashthi": "Chhath", "Sashti": "Chhath",
  "Saptami": "Saatam",
  "Ashtami": "Aatham",
  "Navami": "Nom",
  "Dashami": "Dasham",
  "Ekadashi": "Agiyaras",
  "Dwadashi": "Baras",
  "Trayodashi": "Teras",
  "Chaturdashi": "Chaudas",
  "Purnima": "Poonam", "Poornima": "Poonam",
  "Amavasya": "Amas"
};

const PAKSHA_MAP: Record<string, string> = {
  "Shukla": "Sud",
  "Krishna": "Vad",
  "Waxing Moon": "Sud",
  "Waning Moon": "Vad"
};

const MONTH_MAP: Record<string, string> = {
  'Kartika': 'Kartak', 'Margashirsha': 'Magshar', 'Pausha': 'Posh', 
  'Magha': 'Maha', 'Phalguna': 'Fagan', 'Chaitra': 'Chaitra', 
  'Vaisakha': 'Vaishakh', 'Jyeshtha': 'Jeth', 'Ashadha': 'Ashadh', 
  'Shravana': 'Shravan', 'Bhadrapada': 'Bhadarvo', 'Ashwina': 'Aaso'
};

const AHMEDABAD_COORDS: Coords = { lat: 23.0225, lng: 72.5714 };

// --- HELPER FUNCTIONS ---
const getBackupGujaratiMonth = (date: Date): string => {
  const month = date.getMonth(); 
  // Simple mapping for current Vikram Samvat context
  const months = ["Posh", "Maha", "Fagan", "Chaitra", "Vaishakh", "Jeth", "Ashadh", "Shravan", "Bhadarvo", "Aaso", "Kartak", "Magshar"];
  return months[month] || "Magshar";
};

const calculateVikramSamvat = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 11 = Dec

  // If Nov (10) or Dec (11), we have definitely passed Diwali -> Year + 57
  // If we are in Oct (9), it depends on the Tithi, but for a safe basic check, 
  // we can check if it's late October. 
  // For a static app, checking if month >= 10 (November) is a safe switch-over point.
  
  if (month >= 10) { 
    return (year + 57).toString();
  } else {
    return (year + 56).toString();
  }
};

// --- HOOK ---
export const usePanchang = (): PanchangData | null => {
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);

  useEffect(() => {
    const calculatePanchang = () => {
      try {
        const now = new Date();
        
        // 1. Get Sunrise
        const sunTimes = SunCalc.getTimes(now, AHMEDABAD_COORDS.lat, AHMEDABAD_COORDS.lng);
        const sunriseTime = sunTimes.sunrise;

        // 2. Calculate Panchang
        const panchangObj = new MhahPanchang();
        // Type 'any' used here because library result structure is inconsistent/untyped
        const result: any = panchangObj.calculate(sunriseTime);

        // --- DATA EXTRACTION ---
        
        // Paksha
        const rawPaksha = result.Paksha?.name_en_IN || result.Paksha?.name || "Shukla";
        const gujPaksha = PAKSHA_MAP[rawPaksha] || (rawPaksha.includes('Krishna') ? 'Vad' : 'Sud');

        // Tithi
        const rawTithiName = result.Tithi?.name_en_IN || result.Tithi?.name;
        const gujTithi = TITHI_NAME_MAP[rawTithiName] || rawTithiName;

        // Month (Try Library -> Fallback to Backup)
        let gujMonth = getBackupGujaratiMonth(now);
        if (result.Masa) {
           const rawMonth = result.Masa.name_en_IN || result.Masa.name;
           gujMonth = MONTH_MAP[rawMonth] || gujMonth;
        }

        // Festivals
        const isEkadashi = gujTithi === "Agiyaras";
        const isPoonam = gujTithi === "Poonam";
        
        let festival = '';
        if (isEkadashi) festival = `${gujMonth} ${gujPaksha} Ekadashi`;
        if (isPoonam) festival = `${gujMonth} Poonam`;

        // Format Time
        const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const data: PanchangData = {
          vikramSamvat: calculateVikramSamvat(now),
          maas: gujMonth,
          paksha: gujPaksha,
          tithi: gujTithi,
          fullTithi: `${gujMonth} ${gujPaksha} ${gujTithi}`,
          festival: festival,
          isEkadashi: isEkadashi,
          isPoonam: isPoonam,
          sunrise: formatTime(sunriseTime),
          sunset: formatTime(sunTimes.sunset),
        };

        setPanchangData(data);

      } catch (e) {
        console.error("Panchang Calculation Error:", e);
      }
    };

    calculatePanchang();
  }, []);

  return panchangData;
};