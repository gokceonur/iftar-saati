/**
 * Table Highlight Island - Highlights today's row and updates table on city change
 */

function getTurkeyDateStr(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

function highlightToday() {
  const tbody = document.getElementById('prayer-table-body');
  if (!tbody) return;

  const today = getTurkeyDateStr();
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const date = row.dataset.date;
    row.classList.remove('today', 'past');
    if (date === today) {
      row.classList.add('today');
      // Scroll today's row into view
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (date && date < today) {
      row.classList.add('past');
    }
  });
}

async function loadTableForCity(cityId: string) {
  try {
    const resp = await fetch(`/data/ramadan/${cityId}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // Update city name in header
    const cityNameEl = document.getElementById('table-city-name');
    if (cityNameEl) cityNameEl.textContent = data.cityName;

    // Rebuild table body
    const tbody = document.getElementById('prayer-table-body');
    if (!tbody) return;

    const today = getTurkeyDateStr();

    tbody.innerHTML = data.days.map((day: any) => {
      const isToday = day.date === today;
      const isPast = day.date < today;
      const rowClass = isToday ? 'today' : isPast ? 'past' : '';
      const dateFormatted = new Date(day.date + 'T12:00:00+03:00')
        .toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: 'Europe/Istanbul' });

      return `<tr class="${rowClass}" data-date="${day.date}">
        <td>${day.ramadanDay}</td>
        <td>${dateFormatted}</td>
        <td>${day.imsak}</td>
        <td>${day.gunes}</td>
        <td>${day.ogle}</td>
        <td>${day.ikindi}</td>
        <td>${day.aksam}</td>
        <td>${day.yatsi}</td>
      </tr>`;
    }).join('');

    // Scroll today into view after rebuild
    requestAnimationFrame(() => {
      const todayRow = tbody.querySelector('.today');
      if (todayRow) {
        todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  } catch (err) {
    console.error('Failed to load prayer table data:', err);
  }
}

function init() {
  highlightToday();

  // Listen for city changes
  document.addEventListener('cityChanged', ((e: CustomEvent<{ cityId: string }>) => {
    loadTableForCity(e.detail.cityId);
  }) as EventListener);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
