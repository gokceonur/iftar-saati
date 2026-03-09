import { cityCoordinates, findNearestCity } from './city-coordinates';

const STORAGE_KEY = 'iftar-saati-city';
const DEFAULT_CITY_ID = '9541'; // İstanbul

/**
 * Get the user's city ID - tries geolocation, then localStorage, then default
 * Returns a Promise that resolves to a city ID string
 */
export async function getUserCityId(): Promise<string> {
  // Try geolocation
  try {
    const pos = await getPosition();
    const nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
    localStorage.setItem(STORAGE_KEY, nearest.id);
    return nearest.id;
  } catch {
    // Geolocation failed or denied
  }

  // Try localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  // Default to İstanbul
  return DEFAULT_CITY_ID;
}

export function saveCityId(cityId: string): void {
  localStorage.setItem(STORAGE_KEY, cityId);
}

export function getCityName(cityId: string): string {
  return cityCoordinates.find(c => c.id === cityId)?.name ?? 'İstanbul';
}

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 5000,
      maximumAge: 600000,
    });
  });
}
