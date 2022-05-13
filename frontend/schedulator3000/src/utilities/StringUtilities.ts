// eslint-disable-next-line import/prefer-default-export
export function toFirstUpper(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
