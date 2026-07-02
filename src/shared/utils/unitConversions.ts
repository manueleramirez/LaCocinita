const conversions: Record<string, Record<string, number>> = {
  kg: { g: 1000, lb: 2.20462, oz: 35.274 },
  g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
  lb: { kg: 0.453592, g: 453.592, oz: 16 },
  oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625 },
  l: { ml: 1000 },
  ml: { l: 0.001 },
};

export function convertUnit(value: number, from: string, to: string): number | null {
  if (from === to) return value;

  const factor = conversions[from]?.[to];
  if (factor != null) return value * factor;

  const inverseFactor = conversions[to]?.[from];
  if (inverseFactor != null) return value / inverseFactor;

  return null;
}
