export function getLocalNow(offsetHours = 7) {
  const now = new Date();
  const offsetMillis = offsetHours * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + offsetMillis);
  localNow.setMilliseconds(0);
  return localNow;
}
