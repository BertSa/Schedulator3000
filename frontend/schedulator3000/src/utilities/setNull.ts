export default function setNull<T extends Function>(arg: T) {
  return () => arg(null);
}
