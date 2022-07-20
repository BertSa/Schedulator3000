/* eslint-disable no-bitwise */

function hashCode(string:string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function numberToRGB(num:number) {
  const color: string = (num & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return `#${'00000'.substring(0, 6 - color.length)}${color}`;
}

export default function stringToHexColor(string: string) {
  return numberToRGB(hashCode(string));
}
