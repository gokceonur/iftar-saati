/**
 * Countdown Island - Live countdown timer
 * Listens for 'cityChanged' events to update target times
 */

interface CityDayData {
  imsak: string;
  aksam: string;
  date: string;
}

let currentCityId = '9541';
let cityData: any = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

const RAMADAN_START = '2026-02-19';
const RAMADAN_END = '2026-03-20';

function getTurkeyNow(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' })
  );
}

function getTurkeyDateStr(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

function parseTime(dateStr: string, timeStr: string): Date {
  // Create a date in Turkey time
  const [h, m] = timeStr.split(':').map(Number);
  return new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+03:00`);
}

function formatCountdown(totalSeconds: number): { h: string; m: string; s: string } {
  if (totalSeconds <= 0) return { h: '00', m: '00', s: '00' };
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
  };
}

function findTodayData(): CityDayData | null {
  if (!cityData?.days) return null;
  const today = getTurkeyDateStr();
  return cityData.days.find((d: any) => d.date === today) ?? null;
}

function findTomorrowData(): CityDayData | null {
  if (!cityData?.days) return null;
  const now = getTurkeyNow();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  return cityData.days.find((d: any) => d.date === tomorrowStr) ?? null;
}

function updateCountdown() {
  const now = new Date();
  const todayStr = getTurkeyDateStr();
  const label = document.getElementById('countdown-label')!;
  const timer = document.getElementById('countdown-timer')!;
  const dateEl = document.getElementById('countdown-date')!;
  const bayramEl = document.getElementById('countdown-bayram')!;
  const section = document.getElementById('countdown-section')!;

  // Check if Ramadan is over
  if (todayStr > RAMADAN_END) {
    label.style.display = 'none';
    timer.style.display = 'none';
    dateEl.style.display = 'none';
    bayramEl.style.display = 'block';
    return;
  }

  const todayData = findTodayData();
  if (!todayData) return;

  const imsakTime = parseTime(todayStr, todayData.imsak);
  const aksamTime = parseTime(todayStr, todayData.aksam);

  let targetTime: Date;
  let labelText: string;

  if (now < imsakTime) {
    // Before imsak → counting down to sahur end (imsak)
    targetTime = imsakTime;
    labelText = 'Sahura Kalan Süre';
  } else if (now < aksamTime) {
    // Between imsak and aksam → counting down to iftar
    targetTime = aksamTime;
    labelText = 'İftara Kalan Süre';
  } else {
    // After aksam → counting down to tomorrow's imsak (sahur)
    const tomorrowData = findTomorrowData();
    if (tomorrowData) {
      const tomorrowStr = getTurkeyDateStr();
      const tomorrowNow = getTurkeyNow();
      const tomorrowDate = new Date(tomorrowNow);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tmrStr = tomorrowDate.toISOString().slice(0, 10);
      targetTime = parseTime(tmrStr, tomorrowData.imsak);
      labelText = 'Sahura Kalan Süre';
    } else {
      // Last day of Ramadan, after iftar
      label.style.display = 'none';
      timer.style.display = 'none';
      dateEl.style.display = 'none';
      bayramEl.style.display = 'block';
      return;
    }
  }

  bayramEl.style.display = 'none';
  label.style.display = '';
  timer.style.display = '';

  label.textContent = labelText;

  const diff = Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000));
  const { h, m, s } = formatCountdown(diff);

  const spans = timer.querySelectorAll('span');
  // spans: hours, sep, minutes, sep, seconds
  spans[0].textContent = h;
  spans[2].textContent = m;
  spans[4].textContent = s;

  // Update date display
  const turkeyNow = getTurkeyNow();
  dateEl.textContent = turkeyNow.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });
}

async function loadCityData(cityId: string) {
  try {
    const resp = await fetch(`/data/ramadan/${cityId}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cityData = await resp.json();
    currentCityId = cityId;

    // Update city name displays
    const cityNameEl = document.getElementById('countdown-city');
    if (cityNameEl && cityData?.cityName) {
      cityNameEl.textContent = cityData.cityName;
    }

    updateCountdown();
  } catch (err) {
    console.error('Failed to load city data:', err);
  }
}

function init() {
  // Load initial data from inline JSON (İstanbul)
  const inlineScript = document.getElementById('istanbul-data');
  if (inlineScript) {
    try {
      cityData = JSON.parse(inlineScript.textContent || '');
    } catch {
      // fallback to fetch
    }
  }

  if (!cityData) {
    loadCityData(currentCityId);
  } else {
    updateCountdown();
  }

  // Start interval
  intervalId = setInterval(updateCountdown, 1000);

  // Listen for city changes
  document.addEventListener('cityChanged', ((e: CustomEvent<{ cityId: string; cityName: string }>) => {
    loadCityData(e.detail.cityId);
  }) as EventListener);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
