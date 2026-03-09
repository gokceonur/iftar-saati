/**
 * Carousel Island - Highlights cities based on iftar status
 * - Done cities: green checkmark
 * - Next city: gold highlight, scrolled into view
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

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  const items = track.querySelectorAll<HTMLElement>('.carousel-item');
  const currentTime = getTurkeyTimeStr();
  let nextItem: HTMLElement | null = null;

  items.forEach(item => {
    const aksam = item.dataset.aksam || '';
    item.classList.remove('done', 'next');

    if (aksam <= currentTime) {
      item.classList.add('done');
    } else if (!nextItem) {
      nextItem = item;
      item.classList.add('next');
    }
  });

  // Scroll next item into view
  if (nextItem) {
    const track = nextItem.parentElement;
    if (track) {
      const trackRect = track.getBoundingClientRect();
      const itemRect = (nextItem as HTMLElement).getBoundingClientRect();
      const scrollLeft = track.scrollLeft + (itemRect.left - trackRect.left) - trackRect.width / 2 + itemRect.width / 2;
      track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }
}

function init() {
  updateCarousel();
  // Update every 30 seconds
  setInterval(updateCarousel, 30000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
