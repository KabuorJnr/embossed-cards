/** Ways to get a card to someone. */

export function shareText(link: string, to: string): string {
  const greeting = to.trim() ? `${to.trim()}, I pressed a card for you.` : 'I pressed a card for you.';
  return `${greeting} Open it here: ${link}`;
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export const canNativeShare = () => typeof navigator.share === 'function';

export async function nativeShare(link: string, text: string): Promise<'shared' | 'cancelled' | 'failed'> {
  try {
    await navigator.share({ title: 'A card for you', text, url: link });
    return 'shared';
  } catch (e) {
    return (e as DOMException)?.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers: fall back to a hidden text field.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Save an image, offering the phone's share sheet first so it can go straight to a status. */
export async function saveImage(blob: Blob, name = 'embossed-card.png'): Promise<void> {
  const file = new File([blob], name, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (touch && nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'A card for you' });
      return;
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
