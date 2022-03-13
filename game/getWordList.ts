import { validWords, answerWords } from "./wordList";

export function getWordList() {
  return [...answerWords, ...validWords];
}