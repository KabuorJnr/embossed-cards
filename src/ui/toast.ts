let region: HTMLDivElement | null = null;
let timer = 0;

/** Short status message, announced to screen readers. */
export function toast(message: string) {
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  region.textContent = message;
  region.classList.add('is-on');
  clearTimeout(timer);
  timer = window.setTimeout(() => region?.classList.remove('is-on'), 2600);
}
