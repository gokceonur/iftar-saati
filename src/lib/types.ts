// EzanVakti API response types

export interface ApiCountry {
  UlkeAdi: string;
  UlkeAdiEn: string;
  UlkeID: string;
}

export interface ApiCity {
  SehirAdi: string;
  SehirAdiEn: string;
  SehirID: string;
}

export interface ApiDistrict {
  IlceAdi: string;
  IlceAdiEn: string;
  IlceID: string;
}

export interface ApiPrayerTime {
  Imsak: string;
  Gunes: string;
  Ogle: string;
  Ikindi: string;
  Aksam: string;
  Yatsi: string;
  MiladiTarihKisa: string;
  MiladiTarihUzun: string;
  HicriTarihKisa: string;
  HicriTarihUzun: string;
  AyinSekliURL: string;
}

// App-specific types

export interface CityCompact {
  id: string;       // ilceId
  name: string;     // il adı
  imsak: string;    // HH:MM
  aksam: string;    // HH:MM
}

export interface RamadanAllEntry {
  date: string;     // YYYY-MM-DD
  cities: CityCompact[];
}

export interface PrayerDay {
  date: string;       // YYYY-MM-DD
  hijriDate: string;  // Hicri tarih
  ramadanDay: number;
  imsak: string;
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
}

export interface CityPrayerData {
  cityId: string;
  cityName: string;
  days: PrayerDay[];
}

export interface CityCoordinate {
  id: string;
  name: string;
  lat: number;
  lng: number;
}
