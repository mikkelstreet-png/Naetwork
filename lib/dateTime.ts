export const SESSION_TIME_ZONE = 'Europe/Copenhagen';

function offsetMinutes(date: Date): number {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: SESSION_TIME_ZONE,
    timeZoneName: 'shortOffset',
  }).formatToParts(date).find((item) => item.type === 'timeZoneName')?.value;

  const match = part?.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? 0);
  return match[1] === '-' ? -minutes : minutes;
}

export function copenhagenDateTimeToUtc(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;

  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const firstPass = new Date(guess.getTime() - offsetMinutes(guess) * 60_000);
  const resolved = new Date(guess.getTime() - offsetMinutes(firstPass) * 60_000);

  const roundTrip = new Intl.DateTimeFormat('sv-SE', {
    timeZone: SESSION_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(resolved).replace(' ', 'T');

  return roundTrip === `${date}T${time}` ? resolved : null;
}

export function formatSessionDate(value: string | Date, locale: 'da' | 'en' = 'da') {
  return new Intl.DateTimeFormat(locale === 'da' ? 'da-DK' : 'en-GB', {
    timeZone: SESSION_TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
