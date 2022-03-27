import { DateTime } from 'luxon';
import { GameType } from 'types';

export function getWotDSeed(year: number, month: number, day: number, gameType: GameType) {
  let WotDEpoch = DateTime.fromObject({ year: 2021, month: 6, day: 17 });
  if (gameType === GameType.Wordle) {
    WotDEpoch = DateTime.fromObject({ year: 2021, month: 6, day: 19 });
  }
  const today = DateTime.fromObject({ year, month, day });
  const { days } = today.diff(WotDEpoch, 'days');
  const WotDSeed = Math.floor(days);
  return WotDSeed;
}
