import SunCalc from 'suncalc';
// @ts-ignore
import { MhahPanchang } from 'mhah-panchang';

// --- CONSTANTS ---
export const WEEKDAYS = ['Rav', 'Som', 'Mangal', 'Budh', 'Guru', 'Shukra', 'Shani'];
// Coordinates for Ahmedabad (Crucial for Udaya Tithi)
const COORDS = { lat: 23.0225, lng: 72.5714 };

// --- MAPPINGS ---
const PAKSHA_MAP: Record<string, string> = {
  "Shukla": "Sud", "Krishna": "Vad",
  "Waxing": "Sud", "Waning": "Vad"
};

const MONTH_MAP: Record<string, string> = {
  'Kartika': 'Kartak', 'Margashirsha': 'Magshar', 'Pausha': 'Posh',
  'Magha': 'Maha', 'Phalguna': 'Fagan', 'Chaitra': 'Chaitra',
  'Vaisakha': 'Vaishakh', 'Jyeshtha': 'Jeth', 'Ashadha': 'Ashadh',
  'Shravana': 'Shravan', 'Bhadrapada': 'Bhadarvo', 'Ashwina': 'Aaso'
};

// --- TYPES ---
export interface TithiData {
  tithiIndex: number;
  tithiName: string;
  paksha: 'Sud' | 'Vad';
  gujMonth: string;
  vikramSamvat: number;
  isAgiyaras: boolean;
  isPoonam: boolean;
  isAmas: boolean;
  isHoliday: boolean;
}

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tithi: TithiData;
}

// --- HELPER LOGIC ---

// 1. ROBUST MAPPING HELPER (Fixes Highlighting)
const normalizeTithiName = (rawName: string): string => {
  if (!rawName) return "Ekam";

  const lower = rawName.toLowerCase().trim();

  // Explicit checks to catch variations like "Shukla Purnima", "Poornima", "Purnima"
  if (lower.includes('purnima') || lower.includes('poornima') || lower.includes('pournami')) return "Poonam";
  if (lower.includes('amavasya') || lower.includes('amas')) return "Amas";
  if (lower.includes('ekadashi') || lower.includes('ekadasi')) return "Agiyaras";

  // Standard mappings
  if (lower.includes('pratipada') || lower.includes('padyami') || lower.includes('prathama')) return "Ekam";
  if (lower.includes('dwitiya') || lower.includes('vidiya')) return "Bij";
  if (lower.includes('tritiya') || lower.includes('thadiya')) return "Trij";
  if (lower.includes('chaturthi')) return "Choth";
  if (lower.includes('panchami')) return "Paancham";
  if (lower.includes('shashthi') || lower.includes('sashti')) return "Chhath";
  if (lower.includes('saptami')) return "Saatam";
  if (lower.includes('ashtami')) return "Aatham";
  if (lower.includes('navami')) return "Nom";
  if (lower.includes('dashami')) return "Dasham";
  if (lower.includes('dwadashi')) return "Baras";
  if (lower.includes('trayodashi')) return "Teras";
  if (lower.includes('chaturdashi')) return "Chaudas";

  // If specific mapping not found, capitalize first letter and return (fallback)
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

const getBackupGujaratiMonth = (date: Date): string => {
  const month = date.getMonth();
  const months = ["Posh", "Maha", "Fagan", "Chaitra", "Vaishakh", "Jeth", "Ashadh", "Shravan", "Bhadarvo", "Aaso", "Kartak", "Magshar"];
  return months[month] || "Magshar";
};

const calculateVikramSamvat = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return month >= 10 ? year + 57 : year + 56;
};

// --- CORE CALCULATION ---

// CACHE
const tithiCache: Record<string, TithiData> = {};

export const calculateTithi = (inputDate: Date): TithiData => {
  const date = new Date(inputDate);

  // 2. TIMEZONE FIX: Force calculation for Noon to avoid midnight edge cases
  // Setting hours to 12:00 ensures we are safely in the middle of the day 
  // before asking for Sunrise (which will return the morning of that same day)
  date.setHours(12, 0, 0, 0);

  // Check Cache
  const cacheKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  if (tithiCache[cacheKey]) {
    return tithiCache[cacheKey];
  }

  let tithiName = "Ekam";
  let paksha: 'Sud' | 'Vad' = 'Sud';
  let gujMonth = getBackupGujaratiMonth(date);

  try {
    // Get Sunrise time for this specific date
    const sunTimes = SunCalc.getTimes(date, COORDS.lat, COORDS.lng);

    // 3. CALCULATION: Pass Sunrise time to Panchang
    const panchangObj = new MhahPanchang();
    const result: any = panchangObj.calculate(sunTimes.sunrise);

    if (result) {
      // Log to debug if needed: console.log(date.toDateString(), result.Tithi?.name);

      const rawTithi = result.Tithi?.name_en_IN || result.Tithi?.name;
      tithiName = normalizeTithiName(rawTithi);

      const rawPaksha = result.Paksha?.name_en_IN || result.Paksha?.name || "";
      if (rawPaksha.includes('Krishna') || rawPaksha.includes('Vad') || rawPaksha.includes('Waning')) {
        paksha = 'Vad';
      } else {
        paksha = 'Sud';
      }

      const rawMonth = result.Masa?.name_en_IN || result.Masa?.name;
      if (rawMonth && MONTH_MAP[rawMonth]) {
        gujMonth = MONTH_MAP[rawMonth];
      }
    }
  } catch (e) {
    console.warn("Panchang Error:", e);
  }

  // 4. DERIVED FLAGS (Fixes UI Highlighting)
  // Using explicit string checks matches the result of normalizeTithiName
  const isAgiyaras = tithiName === "Agiyaras";
  const isPoonam = tithiName === "Punnami";
  const isAmas = tithiName === "Amas";

  // Holiday is Sunday
  const isHoliday = inputDate.getDay() === 0;

  const resultData: TithiData = {
    tithiIndex: 1, // Placeholder
    tithiName,
    paksha,
    gujMonth,
    vikramSamvat: calculateVikramSamvat(date),
    isAgiyaras,
    isPoonam,
    isAmas,
    isHoliday
  };

  // Store in cache
  tithiCache[cacheKey] = resultData;

  return resultData;
};

// --- GRID & EVENT GENERATION ---

export const generateCalendarGrid = (baseDate: Date): DayData[] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: DayData[] = [];

  // Padding for previous month
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: false,
      tithi: calculateTithi(d)
    });
  }

  // Current Month
  const today = new Date();
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const isToday = d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    days.push({
      date: d,
      isCurrentMonth: true,
      isToday,
      tithi: calculateTithi(d)
    });
  }

  // Padding for next month
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: false,
      tithi: calculateTithi(d)
    });
  }

  return days;
};

export const getUpcomingAgiyaras = (): { date: Date; tithi: TithiData }[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today

  let checkDate = new Date(today);
  const foundEvents: { date: Date; tithi: TithiData }[] = [];

  // Look ahead 60 days
  for (let i = 0; i < 60; i++) {
    // Create new date object for specific day loop
    const dateForCalc = new Date(checkDate);
    const tithi = calculateTithi(dateForCalc);

    if (tithi.isAgiyaras) {
      foundEvents.push({ date: dateForCalc, tithi });
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  // Filter to ensure we don't show consecutive days of same Agiyaras
  const uniqueEvents: { date: Date; tithi: TithiData }[] = [];
  for (const event of foundEvents) {
    if (uniqueEvents.length > 0) {
      const lastDate = uniqueEvents[uniqueEvents.length - 1].date;
      const diffTime = Math.abs(event.date.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 10) continue;
    }
    uniqueEvents.push(event);
    if (uniqueEvents.length >= 2) break;
  }
  return uniqueEvents;
};