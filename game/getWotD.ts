import { GameType, SimpleDate } from 'types';
import { getWotDSeed } from 'game/getSeeds';
import { answerWords } from './wordList';
import NYTAnswers from './NYTAnswerList.json';

export function getWotD(date: SimpleDate, gameType = GameType.WotD) {
  const { year, month, day } = date;
  const WotDSeed = getWotDSeed(year, month, day, gameType);

  if (gameType === GameType.WotD) {
    if (!date) throw new Error('No date was given when attempting to get the Word of the Day.');
    return { seed: WotDSeed, answer: answerWords[WotDSeed].toUpperCase() };
  }
  if (gameType === GameType.Wordle) {
    if (!date) throw new Error('No date was given when attempting to get the Wordle for today.');
    return { seed: WotDSeed, answer: NYTAnswers[WotDSeed].toUpperCase() };
  }
  const randomSeed = Math.floor(Math.random() * answerWords.length - 1);
  return { seed: randomSeed, answer: answerWords[randomSeed].toUpperCase() };
}
