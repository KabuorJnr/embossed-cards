import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/hanken-grotesk/600.css';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/500.css';
import './styles/base.css';
import './styles/legal.css';
import { forgetEverything } from './ui/consent';
import { toast } from './ui/toast';

document.querySelectorAll<HTMLButtonElement>('[data-forget]').forEach((btn) =>
  btn.addEventListener('click', () => {
    forgetEverything();
    toast('Done. Nothing from Embossed is kept on this device.');
  }),
);
