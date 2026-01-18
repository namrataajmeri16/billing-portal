export function calculateProration({
  oldPriceCents,
  newPriceCents,
  periodStart,
  periodEnd,
  changeDate,
}: {
  oldPriceCents: number;
  newPriceCents: number;
  periodStart: Date;
  periodEnd: Date;
  changeDate: Date;
}) {
  const totalMs = periodEnd.getTime() - periodStart.getTime();
  const remainingMs = periodEnd.getTime() - changeDate.getTime();

  const remainingRatio = remainingMs / totalMs;

  const credit = Math.round(oldPriceCents * remainingRatio);
  const charge = Math.round(newPriceCents * remainingRatio);

  return {
    creditCents: credit,
    chargeCents: charge,
    prorationCents: charge - credit,
  };
}
