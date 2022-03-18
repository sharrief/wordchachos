export function shortNumber(number: number) {
  return Intl.NumberFormat('en-us', {
    notation: 'compact', compactDisplay: 'short', minimumSignificantDigits: 1,
  }).format(number);
}
