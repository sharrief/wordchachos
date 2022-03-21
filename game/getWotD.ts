import { GameType, SimpleDate } from 'types';
import { getWordleSeed } from 'game/getWordleSeed';
import { answerWords } from './wordList';

export function getWotD(date?: SimpleDate, gameType = GameType.wordle) {
  if (gameType === GameType.wordle) {
    if (!date) throw new Error('No date was given when attempting to get the Wordle of the day.');
    const { year, month, day } = date;
    const wordleSeed = getWordleSeed(year, month, day);
    return { seed: wordleSeed, answer: answerWords[wordleSeed].toUpperCase() };
  }
  const randomSeed = Math.floor(Math.random() * answerWords.length - 1);
  return { seed: randomSeed, answer: answerWords[randomSeed].toUpperCase() };
}
