/**
 * Build-time script: Fetches Ramadan prayer times from EzanVakti API
 * for all 81 provinces and saves as static JSON files.
 *
 * Dynamically discovers correct merkez ilce IDs from the API.
 *
 * Usage: npx tsx scripts/fetch-data.ts
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync, cpSync, rmSync } from 'fs';
import { join } from 'path';

const API_BASE = 'https://ezanvakti.emushaf.net';
const ROOT_DIR = join(import.meta.dirname, '..');
const DATA_DIR = join(ROOT_DIR, 'src', 'data');
const RAMADAN_DIR = join(DATA_DIR, 'ramadan');
const PUBLIC_DATA_DIR = join(ROOT_DIR, 'public', 'data');
const PUBLIC_RAMADAN_DIR = join(PUBLIC_DATA_DIR, 'ramadan');

// Provinces where merkez ilce name differs from province name
const MERKEZ_EXCEPTIONS: Record<string, string> = {
  'Kocaeli': 'İzmit',
  'Sakarya': 'Adapazarı',
  'Hatay': 'Antakya',
};

interface ApiCity {
  SehirAdi: string;
  SehirAdiEn: string;
  SehirID: string;
}

interface ApiDistrict {
  IlceAdi: string;
  IlceAdiEn: string;
  IlceID: string;
}

interface ApiPrayerTime {
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
}

interface PrayerDay {
  date: string;
  hijriDate: string;
  ramadanDay: number;
  imsak: string;
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
}

interface CityCompact {
  id: string;
  name: string;
  imsak: string;
  aksam: string;
}

interface RamadanAllEntry {
  date: string;
  cities: CityCompact[];
}

interface CityMapping {
  ilceId: string;
  sehirId: string;
  sehirAdi: string;
  ilceAdi: string;
}

async function fetchWithRetry(url: string, retries = 5): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.warn(`  Retry ${i + 1}/${retries} for ${url}: ${err}`);
      if (i === retries - 1) throw err;
      // Exponential backoff: 2s, 4s, 8s, 16s
      await new Promise(r => setTimeout(r, 2000 * Math.pow(2, i)));
    }
  }
}

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase('tr-TR');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Discover correct merkez ilce IDs from the API
 */
async function discoverCityIds(): Promise<CityMapping[]> {
  console.log('Discovering city IDs from API...\n');

  // Get all provinces (Turkey = country ID 2)
  const cities: ApiCity[] = await fetchWithRetry(`${API_BASE}/sehirler/2`);
  console.log(`  Found ${cities.length} provinces`);

  const mappings: CityMapping[] = [];

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // Delay between requests
    if (i > 0) {
      await new Promise(r => setTimeout(r, 1500));
    }

    // Get districts for this province
    const districts: ApiDistrict[] = await fetchWithRetry(`${API_BASE}/ilceler/${city.SehirID}`);

    // Find merkez ilce
    const expectedName = MERKEZ_EXCEPTIONS[city.SehirAdi] || city.SehirAdi;
    const normalizedExpected = normalizeName(expectedName);

    // Try exact match
    let merkez = districts.find(d => normalizeName(d.IlceAdi) === normalizedExpected);

    // Fallback: partial match
    if (!merkez) {
      merkez = districts.find(d =>
        normalizeName(d.IlceAdi).includes(normalizedExpected) ||
        normalizedExpected.includes(normalizeName(d.IlceAdi))
      );
    }

    // Final fallback: first district
    if (!merkez) {
      console.warn(`  WARNING: No merkez match for ${city.SehirAdi}, using first district: ${districts[0]?.IlceAdi}`);
      merkez = districts[0];
    }

    if (merkez) {
      mappings.push({
        ilceId: merkez.IlceID,
        sehirId: city.SehirID,
        sehirAdi: city.SehirAdi,
        ilceAdi: merkez.IlceAdi,
      });
      console.log(`  [${i + 1}/${cities.length}] ${city.SehirAdi} -> ${merkez.IlceAdi} (${merkez.IlceID})`);
    }
  }

  return mappings;
}

/**
 * Update source files with correct IDs from mapping.
 * API returns uppercase names (İSTANBUL), source files use title case (İstanbul),
 * so we match by normalized name.
 */
function updateSourceFiles(mappings: CityMapping[]) {
  // Build normalized name -> new ID map
  const normalizedToNewId: Record<string, string> = {};
  for (const m of mappings) {
    normalizedToNewId[normalizeName(m.sehirAdi)] = m.ilceId;
  }

  // Extract current entries from city-coordinates.ts (the source of truth for names)
  const coordsFile = join(ROOT_DIR, 'src', 'lib', 'city-coordinates.ts');
  const origCoords = readFileSync(coordsFile, 'utf-8');

  const sourceEntries: Array<{ oldId: string; name: string }> = [];
  const entryRegex = /id:\s*'([^']*)'\s*,\s*name:\s*'([^']*)'/g;
  let match;
  while ((match = entryRegex.exec(origCoords)) !== null) {
    sourceEntries.push({ oldId: match[1], name: match[2] });
  }

  // Get old Istanbul ID BEFORE any changes
  const istEntry = sourceEntries.find(e => normalizeName(e.name) === normalizeName('İstanbul'));
  const oldIstanbulId = istEntry?.oldId || '20089';
  const newIstanbulId = normalizedToNewId[normalizeName('İstanbul')];

  // Step 1: Update coordinate arrays by matching source file city names
  const coordFiles = [
    coordsFile,
    join(ROOT_DIR, 'src', 'islands', 'city-selector-island.ts'),
  ];

  for (const filePath of coordFiles) {
    let content = readFileSync(filePath, 'utf-8');
    for (const entry of sourceEntries) {
      const newId = normalizedToNewId[normalizeName(entry.name)];
      if (newId && newId !== entry.oldId) {
        const regex = new RegExp(
          `(id:\\s*')${escapeRegex(entry.oldId)}(',\\s*name:\\s*'${escapeRegex(entry.name)}')`,
          'g'
        );
        content = content.replace(regex, `$1${newId}$2`);
      }
    }
    writeFileSync(filePath, content);
    console.log(`  Updated coordinate IDs: ${filePath}`);
  }

  // Step 2: Update Istanbul default ID references (targeted patterns only,
  // NOT blanket replaceAll — another city might share the same ID value)
  if (oldIstanbulId !== newIstanbulId && newIstanbulId) {
    const targetedReplacements = [
      { old: `DEFAULT_CITY_ID = '${oldIstanbulId}'`, rep: `DEFAULT_CITY_ID = '${newIstanbulId}'` },
      { old: `currentCityId = '${oldIstanbulId}'`, rep: `currentCityId = '${newIstanbulId}'` },
      { old: `=== '${oldIstanbulId}'`, rep: `=== '${newIstanbulId}'` },
      { old: `ramadan/${oldIstanbulId}.json`, rep: `ramadan/${newIstanbulId}.json` },
    ];

    const defaultFiles = [
      join(ROOT_DIR, 'src', 'islands', 'city-selector-island.ts'),
      join(ROOT_DIR, 'src', 'lib', 'geo-utils.ts'),
      join(ROOT_DIR, 'src', 'islands', 'countdown-island.ts'),
      join(ROOT_DIR, 'src', 'components', 'CitySelector.astro'),
      join(ROOT_DIR, 'src', 'components', 'PrayerTable.astro'),
    ];

    for (const filePath of defaultFiles) {
      let content = readFileSync(filePath, 'utf-8');
      let changed = false;
      for (const r of targetedReplacements) {
        if (content.includes(r.old)) {
          content = content.replaceAll(r.old, r.rep);
          changed = true;
        }
      }
      if (changed) {
        writeFileSync(filePath, content);
        console.log(`  Updated Istanbul default ID: ${filePath}`);
      }
    }
  }
}

function parseDate(miladiKisa: string): string {
  // "09.03.2026" -> "2026-03-09"
  const [d, m, y] = miladiKisa.split('.');
  return `${y}-${m}-${d}`;
}

// Ramazan 1447: 19 Subat 2026 - 20 Mart 2026
const RAMADAN_START = '2026-02-19';
const RAMADAN_END = '2026-03-20';

function isRamadanDate(dateStr: string): boolean {
  return dateStr >= RAMADAN_START && dateStr <= RAMADAN_END;
}

function getRamadanDay(dateStr: string): number {
  const date = new Date(dateStr + 'T12:00:00+03:00');
  const start = new Date(RAMADAN_START + 'T12:00:00+03:00');
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

async function main() {
  console.log('Fetching Ramadan prayer times for 81 provinces...\n');

  // Ensure directories exist
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(RAMADAN_DIR, { recursive: true });

  // Step 1: Discover or load city IDs
  const mappingFile = join(DATA_DIR, 'city-mapping.json');
  let mappings: CityMapping[];

  if (existsSync(mappingFile)) {
    console.log('Loading cached city mapping...');
    mappings = JSON.parse(readFileSync(mappingFile, 'utf-8'));
    console.log(`  ${mappings.length} cities loaded from cache\n`);
  } else {
    mappings = await discoverCityIds();
    writeFileSync(mappingFile, JSON.stringify(mappings, null, 2));
    console.log(`\nSaved city mapping (${mappings.length} cities)\n`);

    // Update source files with correct IDs
    console.log('Updating source files with correct IDs...');
    updateSourceFiles(mappings);

    // Clean old ramadan data (IDs changed, filenames will differ)
    console.log('\nCleaning old prayer time data...');
    if (existsSync(RAMADAN_DIR)) {
      rmSync(RAMADAN_DIR, { recursive: true });
      mkdirSync(RAMADAN_DIR, { recursive: true });
    }
    if (existsSync(PUBLIC_RAMADAN_DIR)) {
      rmSync(PUBLIC_RAMADAN_DIR, { recursive: true });
    }
    if (existsSync(join(DATA_DIR, 'ramadan-all.json'))) {
      rmSync(join(DATA_DIR, 'ramadan-all.json'));
    }
    if (existsSync(join(PUBLIC_DATA_DIR, 'ramadan-all.json'))) {
      rmSync(join(PUBLIC_DATA_DIR, 'ramadan-all.json'));
    }
  }

  // Build ID->name map
  const cityIds: Record<string, string> = {};
  for (const m of mappings) {
    cityIds[m.ilceId] = m.sehirAdi;
  }

  // Step 2: Fetch prayer times
  console.log('Fetching prayer times...\n');

  const allDatesMap: Map<string, CityCompact[]> = new Map();
  const ilceIds = Object.keys(cityIds);
  let completed = 0;

  for (const ilceId of ilceIds) {
    const outFile = join(RAMADAN_DIR, `${ilceId}.json`);
    if (existsSync(outFile)) {
      // Load existing data into allDatesMap (resume support)
      const existing = JSON.parse(readFileSync(outFile, 'utf-8'));
      for (const day of existing.days) {
        if (!allDatesMap.has(day.date)) allDatesMap.set(day.date, []);
        allDatesMap.get(day.date)!.push({
          id: ilceId,
          name: cityIds[ilceId],
          imsak: day.imsak,
          aksam: day.aksam,
        });
      }
      completed++;
      console.log(`  [${completed}/${ilceIds.length}] ${cityIds[ilceId]} - cached`);
      continue;
    }

    // Delay between requests
    if (completed > 0) {
      await new Promise(r => setTimeout(r, 1500));
    }

    const cityName = cityIds[ilceId];
    try {
      const url = `${API_BASE}/vakitler/${ilceId}`;
      const data: ApiPrayerTime[] = await fetchWithRetry(url);

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn(`  No data for ${cityName} (${ilceId})`);
        continue;
      }

      // Filter Ramadan days
      const ramadanDays: PrayerDay[] = [];

      for (const day of data) {
        const dateStr = parseDate(day.MiladiTarihKisa);
        if (!isRamadanDate(dateStr)) continue;

        const prayerDay: PrayerDay = {
          date: dateStr,
          hijriDate: day.HicriTarihKisa,
          ramadanDay: getRamadanDay(dateStr),
          imsak: day.Imsak,
          gunes: day.Gunes,
          ogle: day.Ogle,
          ikindi: day.Ikindi,
          aksam: day.Aksam,
          yatsi: day.Yatsi,
        };

        ramadanDays.push(prayerDay);

        // Add to allDatesMap
        if (!allDatesMap.has(dateStr)) {
          allDatesMap.set(dateStr, []);
        }
        allDatesMap.get(dateStr)!.push({
          id: ilceId,
          name: cityName,
          imsak: day.Imsak,
          aksam: day.Aksam,
        });
      }

      // Write per-city file
      const cityData = {
        cityId: ilceId,
        cityName,
        days: ramadanDays,
      };
      writeFileSync(
        join(RAMADAN_DIR, `${ilceId}.json`),
        JSON.stringify(cityData)
      );

      completed++;
      console.log(`  [${completed}/${ilceIds.length}] ${cityName} - ${ramadanDays.length} days`);
    } catch (err) {
      console.error(`  FAILED: ${cityName} (${ilceId}): ${err}`);
    }
  }

  // Build ramadan-all.json: sorted by date, cities sorted by aksam (earliest first = east)
  const allDates: RamadanAllEntry[] = [];
  for (const [date, cities] of Array.from(allDatesMap.entries()).sort()) {
    cities.sort((a, b) => a.aksam.localeCompare(b.aksam));
    allDates.push({ date, cities });
  }

  writeFileSync(
    join(DATA_DIR, 'ramadan-all.json'),
    JSON.stringify(allDates)
  );

  // Copy to public dir for runtime access
  mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
  mkdirSync(PUBLIC_RAMADAN_DIR, { recursive: true });
  cpSync(DATA_DIR, PUBLIC_DATA_DIR, { recursive: true });

  console.log(`\nDone! ${completed} cities processed.`);
  console.log(`  ramadan-all.json: ${allDates.length} dates`);
  console.log(`  Per-city files: ${completed} files in ramadan/`);
  console.log(`  Copied to public/data/ for runtime access`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
