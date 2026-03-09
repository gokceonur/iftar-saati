import type { CityCoordinate } from './types';

/**
 * 81 il merkezi koordinatları
 * id: Diyanet API ilçe ID'si (il merkezi)
 */
export const cityCoordinates: CityCoordinate[] = [
  { id: '9146', name: 'Adana', lat: 37.0, lng: 35.3213 },
  { id: '9158', name: 'Adıyaman', lat: 37.7648, lng: 38.2786 },
  { id: '9167', name: 'Afyonkarahisar', lat: 38.7507, lng: 30.5567 },
  { id: '9185', name: 'Ağrı', lat: 39.7191, lng: 43.0503 },
  { id: '9198', name: 'Amasya', lat: 40.6499, lng: 35.8353 },
  { id: '9206', name: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { id: '9225', name: 'Antalya', lat: 36.8969, lng: 30.7133 },
  { id: '9246', name: 'Artvin', lat: 41.1828, lng: 41.8183 },
  { id: '9252', name: 'Aydın', lat: 37.8560, lng: 27.8416 },
  { id: '9270', name: 'Balıkesir', lat: 39.6484, lng: 27.8826 },
  { id: '9297', name: 'Bilecik', lat: 40.0567, lng: 30.0665 },
  { id: '9303', name: 'Bingöl', lat: 38.8855, lng: 40.4966 },
  { id: '9311', name: 'Bitlis', lat: 38.4010, lng: 42.1095 },
  { id: '9315', name: 'Bolu', lat: 40.7360, lng: 31.6061 },
  { id: '9327', name: 'Burdur', lat: 37.7203, lng: 30.2908 },
  { id: '9335', name: 'Bursa', lat: 40.1885, lng: 29.0610 },
  { id: '9352', name: 'Çanakkale', lat: 40.1553, lng: 26.4142 },
  { id: '9359', name: 'Çankırı', lat: 40.6013, lng: 33.6134 },
  { id: '9370', name: 'Çorum', lat: 40.5506, lng: 34.9556 },
  { id: '9392', name: 'Denizli', lat: 37.7765, lng: 29.0864 },
  { id: '9402', name: 'Diyarbakır', lat: 37.9144, lng: 40.2306 },
  { id: '9419', name: 'Edirne', lat: 41.6818, lng: 26.5623 },
  { id: '9432', name: 'Elazığ', lat: 38.6810, lng: 39.2264 },
  { id: '9440', name: 'Erzincan', lat: 39.7500, lng: 39.5000 },
  { id: '9451', name: 'Erzurum', lat: 39.9055, lng: 41.2658 },
  { id: '9470', name: 'Eskişehir', lat: 39.7667, lng: 30.5256 },
  { id: '9479', name: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  { id: '9494', name: 'Giresun', lat: 40.9128, lng: 38.3895 },
  { id: '9501', name: 'Gümüşhane', lat: 40.4386, lng: 39.5086 },
  { id: '9507', name: 'Hakkari', lat: 37.5833, lng: 43.7333 },
  { id: '20089', name: 'Hatay', lat: 36.4018, lng: 36.3498 },
  { id: '9528', name: 'Isparta', lat: 37.7648, lng: 30.5566 },
  { id: '9737', name: 'Mersin', lat: 36.8121, lng: 34.6415 },
  { id: '9541', name: 'İstanbul', lat: 41.0082, lng: 28.9784 },
  { id: '9560', name: 'İzmir', lat: 38.4192, lng: 27.1287 },
  { id: '9594', name: 'Kars', lat: 40.6167, lng: 43.1000 },
  { id: '9609', name: 'Kastamonu', lat: 41.3887, lng: 33.7827 },
  { id: '9620', name: 'Kayseri', lat: 38.7312, lng: 35.4787 },
  { id: '9638', name: 'Kırklareli', lat: 41.7333, lng: 27.2167 },
  { id: '9646', name: 'Kırşehir', lat: 39.1425, lng: 34.1709 },
  { id: '9654', name: 'Kocaeli', lat: 40.8533, lng: 29.8815 },
  { id: '9676', name: 'Konya', lat: 37.8746, lng: 32.4932 },
  { id: '9689', name: 'Kütahya', lat: 39.4167, lng: 29.9833 },
  { id: '9703', name: 'Malatya', lat: 38.3552, lng: 38.3095 },
  { id: '9716', name: 'Manisa', lat: 38.6191, lng: 27.4289 },
  { id: '9577', name: 'Kahramanmaraş', lat: 37.5858, lng: 36.9371 },
  { id: '9726', name: 'Mardin', lat: 37.3212, lng: 40.7245 },
  { id: '9747', name: 'Muğla', lat: 37.2153, lng: 28.3636 },
  { id: '9755', name: 'Muş', lat: 38.9462, lng: 41.7539 },
  { id: '9760', name: 'Nevşehir', lat: 38.6939, lng: 34.6857 },
  { id: '9766', name: 'Niğde', lat: 37.9667, lng: 34.6833 },
  { id: '9782', name: 'Ordu', lat: 40.9839, lng: 37.8764 },
  { id: '9799', name: 'Rize', lat: 41.0201, lng: 40.5234 },
  { id: '9807', name: 'Sakarya', lat: 40.6940, lng: 30.4358 },
  { id: '9819', name: 'Samsun', lat: 41.2928, lng: 36.3313 },
  { id: '9839', name: 'Siirt', lat: 37.9333, lng: 41.9500 },
  { id: '9847', name: 'Sinop', lat: 42.0231, lng: 35.1531 },
  { id: '9868', name: 'Sivas', lat: 39.7477, lng: 37.0179 },
  { id: '9879', name: 'Tekirdağ', lat: 40.9781, lng: 27.5126 },
  { id: '9887', name: 'Tokat', lat: 40.3167, lng: 36.5544 },
  { id: '9905', name: 'Trabzon', lat: 41.0027, lng: 39.7168 },
  { id: '9914', name: 'Tunceli', lat: 39.1079, lng: 39.5401 },
  { id: '9831', name: 'Şanlıurfa', lat: 37.1591, lng: 38.7969 },
  { id: '9919', name: 'Uşak', lat: 38.6823, lng: 29.4082 },
  { id: '9930', name: 'Van', lat: 38.5012, lng: 43.3730 },
  { id: '9949', name: 'Yozgat', lat: 39.8181, lng: 34.8147 },
  { id: '9955', name: 'Zonguldak', lat: 41.4564, lng: 31.7987 },
  { id: '9193', name: 'Aksaray', lat: 38.3687, lng: 34.0370 },
  { id: '9295', name: 'Bayburt', lat: 40.2552, lng: 40.2249 },
  { id: '9587', name: 'Karaman', lat: 37.1759, lng: 33.2287 },
  { id: '9635', name: 'Kırıkkale', lat: 39.8468, lng: 33.5153 },
  { id: '9288', name: 'Batman', lat: 37.8812, lng: 41.1351 },
  { id: '9854', name: 'Şırnak', lat: 37.4187, lng: 42.4918 },
  { id: '9285', name: 'Bartın', lat: 41.6344, lng: 32.3375 },
  { id: '9238', name: 'Ardahan', lat: 41.1105, lng: 42.7022 },
  { id: '9522', name: 'Iğdır', lat: 39.8880, lng: 44.0048 },
  { id: '9935', name: 'Yalova', lat: 40.6500, lng: 29.2667 },
  { id: '9581', name: 'Karabük', lat: 41.2061, lng: 32.6204 },
  { id: '9629', name: 'Kilis', lat: 36.7184, lng: 37.1212 },
  { id: '9788', name: 'Osmaniye', lat: 37.0746, lng: 36.2464 },
  { id: '9414', name: 'Düzce', lat: 40.8438, lng: 31.1565 },
];

/**
 * Find nearest city to given coordinates using Haversine distance
 */
export function findNearestCity(lat: number, lng: number): CityCoordinate {
  let nearest = cityCoordinates[0];
  let minDist = Infinity;

  for (const city of cityCoordinates) {
    const dist = haversine(lat, lng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}
