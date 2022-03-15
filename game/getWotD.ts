import { answerWords } from './wordList';
import { GameType, SimpleDate } from '@types';
import { getWordleSeed } from './getWordleSeed';

export function getWotD(gameType = GameType.wordle, date: SimpleDate) {
  switch (gameType) {
    case GameType.wordle:
      if (!date) throw new Error('No date was given when attempting to get the Wordle of the day.')
      const { year, month, day } = date;
      const wordleSeed = getWordleSeed(year, month, day);
      return answerWords[wordleSeed] || 'error';
    case GameType.random:
    default:
      const randomSeed = Math.floor(Math.random() * answerWords.length - 1);
      return answerWords[randomSeed] || 'error';
  }
}