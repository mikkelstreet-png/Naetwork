export const ECONOMICS = {
  sessionMinutes: 60,
  minPriceDkk: 600,
  maxPriceDkk: 1800,
  charityPercent: 50,
  professionalPercent: 35,
  platformPercent: 15,
  charityName: 'Kræftens Bekæmpelse',
  sessionsCompletedLabel: 'Snart',
} as const;

export function formatDkk(amount: number) {
  return `DKK ${Math.round(amount).toLocaleString('da-DK')}`;
}

export function splitPayment(priceDkk: number) {
  return {
    charity: Math.round(priceDkk * (ECONOMICS.charityPercent / 100)),
    professional: Math.round(priceDkk * (ECONOMICS.professionalPercent / 100)),
    platform: Math.round(priceDkk * (ECONOMICS.platformPercent / 100)),
  };
}

export function economicsSummary(priceDkk: number) {
  const split = splitPayment(priceDkk);
  return `${formatDkk(split.charity)} til ${ECONOMICS.charityName} · ${formatDkk(split.professional)} til eksperten · ${formatDkk(split.platform)} til platformen`;
}
