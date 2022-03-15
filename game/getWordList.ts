import { validWords, answerWords } from 'game/wordList';

export function getWordList() {
  return [...answerWords, ...validWords];
}
