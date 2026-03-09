/**
 * Carousel Island - Highlights cities based on iftar/sahur status
 * - Done cities: green checkmark
 * - Next city: gold highlight, scrolled into view
 * - After all iftars + 1 hour: switches to sahur mode showing tomorrow's imsak times
 */

function getTurkeyNow(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' })
  );
}

function getTurkeyTimeStr(): string {
  const now = getTurkeyNow();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function isSahurMode(currentTime: string, lastAksam: string): boolean {
  if (!lastAksam) return false;

  const currentHour = parseInt(currentTime.slice(0, 2), 10);

  // Midnight to 05:59 → automatically sahur mode (past threshold from previous evening)
  if (currentHour < 6) return true;

  // Calculate threshold: lastAksam + 1 hour
  const [h, m] = lastAksam.split(':').map(Number);
  const thresholdMinutes = h * 60 + m + 60;
  const thresholdH = String(Math.floor(thresholdMinutes / 60) % 24).padStart(2, '0');
  const thresholdM = String(thresholdMinutes % 60).padStart(2, '0');
  const threshold = `${thresholdH}:${thresholdM}`;

  return currentTime >= threshold;
}

function scrollNextIntoView(nextItem: HTMLElement) {
  const track = nextItem.parentElement;
  if (!track) return;
  const trackRect = track.getBoundingClientRect();
  const itemRect = nextItem.getBoundingClientRect();
  const scrollLeft = track.scrollLeft + (itemRect.left - trackRect.left) - trackRect.width / 2 + itemRect.width / 2;
  track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
}

function updateTrack(track: HTMLElement, timeAttr: string, currentTime: string) {
  const items = track.querySelectorAll<HTMLElement>('.carousel-item');
  let nextItem: HTMLElement | null = null;

  items.forEach(item => {
    const time = item.dataset[timeAttr] || '';
    item.classList.remove('done', 'next');

    if (time <= currentTime) {
      item.classList.add('done');
    } else if (!nextItem) {
      nextItem = item;
      item.classList.add('next');
    }
  });

  if (nextItem) {
    scrollNextIntoView(nextItem);
  }
}

function updateCarousel() {
  const wrapper = document.querySelector<HTMLElement>('.carousel-wrapper');
  if (!wrapper) return;

  const lastAksam = wrapper.dataset.lastAksam || '';
  const currentTime = getTurkeyTimeStr();
  const sahur = isSahurMode(currentTime, lastAksam);

  const iftarTrack = document.getElementById('carousel-track');
  const sahurTrack = document.getElementById('carousel-track-sahur');
  const modeLabel = document.getElementById('carousel-mode-label');

  if (sahur && sahurTrack) {
    // Sahur mode
    if (iftarTrack) iftarTrack.style.display = 'none';
    sahurTrack.style.display = 'flex';
    if (modeLabel) modeLabel.textContent = 'Sahur Saatleri';
    updateTrack(sahurTrack, 'imsak', currentTime);
  } else {
    // Iftar mode
    if (iftarTrack) {
      iftarTrack.style.display = 'flex';
      updateTrack(iftarTrack, 'aksam', currentTime);
    }
    if (sahurTrack) sahurTrack.style.display = 'none';
    if (modeLabel) modeLabel.textContent = 'İftar Saatleri';
  }
}

function init() {
  updateCarousel();
  setInterval(updateCarousel, 30000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
