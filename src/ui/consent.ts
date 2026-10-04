import type { CardState } from '../share/encode';

/**
 * Embossed sets no cookies. The only thing it can keep is an unfinished card,
 * in this browser, and only if the person says yes.
 */
const CHOICE = 'embossed.storage';
const DRAFT = 'embossed.draft';

type Choice = 'keep' | 'skip';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage blocked: nothing is kept, which is fine */
  }
}

export const storageChoice = (): Choice | null => {
  const v = read(CHOICE);
  return v === 'keep' || v === 'skip' ? v : null;
};

export function setStorageChoice(choice: Choice) {
  write(CHOICE, choice);
  if (choice === 'skip') write(DRAFT, null);
}

export function saveDraft(state: CardState) {
  if (storageChoice() === 'keep') write(DRAFT, JSON.stringify(state));
}

export function loadDraft(): Partial<CardState> | null {
  if (storageChoice() !== 'keep') return null;
  try {
    return JSON.parse(read(DRAFT) ?? 'null');
  } catch {
    return null;
  }
}

/** Remove everything Embossed has kept in this browser. */
export function forgetEverything() {
  write(DRAFT, null);
  write(CHOICE, null);
}

/** Shows the storage notice once. Both choices are equal: no pre-ticked boxes, no hidden reject. */
export function consentBanner(base = './'): void {
  if (storageChoice()) return;
  const el = document.createElement('section');
  el.className = 'consent';
  el.setAttribute('aria-label', 'Storage choice');
  el.innerHTML = `
    <p>Embossed uses no tracking or advertising cookies. Can we keep your unfinished card in this browser so it is still here when you come back?
      <a href="${base}legal/cookies.html">Cookie policy</a></p>
    <div class="consent-actions">
      <button type="button" class="btn btn-quiet" data-choice="skip">Don't keep it</button>
      <button type="button" class="btn btn-quiet" data-choice="keep">Keep my draft</button>
    </div>`;
  el.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-choice]');
    if (!btn) return;
    setStorageChoice(btn.dataset.choice as Choice);
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 260);
    document.dispatchEvent(new CustomEvent('storagechoice'));
  });
  document.body.append(el);
}
