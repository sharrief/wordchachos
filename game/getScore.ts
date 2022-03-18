export function getScore(guessesUsed: number) {
  const scoreMap: {[guesses: number]: number} = {
    1: 750,
    2: 250,
    3: 100,
    4: 50,
    5: 25,
    6: 0,
  };
  return scoreMap[guessesUsed] || 0;
}
