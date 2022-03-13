import {answerWords} from './wordList';
export async function getWotD() {
  const randomSeed = Math.floor(Math.random() * answerWords.length -1);
  return answerWords[randomSeed];
}