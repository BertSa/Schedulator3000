/* eslint-disable no-bitwise,no-mixed-operators,no-nested-ternary */
export const regex = Object.freeze({
  email: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
  phone: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
  password: /.{5,}/,
  name: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
});

// Credits: https://github.com/erming/stringcolor/blob/gh-pages/stringcolor.js
export function stringToColor(string: string) {
  let hash = 0;

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = ((hash >> 24) & 0xFF).toString(16)
        + ((hash >> 16) & 0xFF).toString(16)
        + ((hash >> 8) & 0xFF).toString(16)
        + (hash & 0xFF).toString(16);

  const num = parseInt(color, 16);
  const amt = Math.round(2.55 * -10);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;

  const s: string = (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000
        + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100
        + (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1);
  return `#${s}`;
}
