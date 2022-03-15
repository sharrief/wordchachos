import { DateTime } from 'luxon';

export function getWordleSeed(year: number, month: number, day: number) {
  const wordleEpoch = DateTime.fromObject({ year: 2021, month: 6, day: 17 });
  const today = DateTime.fromObject({ year, month, day });
  const { days } = today.diff(wordleEpoch, 'days');
  const wordleSeed = Math.floor(days);
  return wordleSeed;
}