import { answerWords } from './wordList';
import { DateTime } from 'luxon';
import { GameType } from '@types';

export function getWotD(gameType = GameType.wordle) {
  switch (gameType) {
    case GameType.wordle:
      const wordleEpoch = DateTime.fromObject({ year: 2021, month: 6, day: 17 });
      const today = DateTime.local();
      const { days } = today.diff(wordleEpoch, 'days');
      const wordleSeed = Math.floor(days);
      return answerWords[wordleSeed] || 'error';
    case GameType.random:
    default:
      const randomSeed = Math.floor(Math.random() * answerWords.length - 1);
      return answerWords[randomSeed] || 'error';
  }
}