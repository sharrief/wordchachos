export const Labels = {
  SiteTitle: 'wordchachos',
  WinTitle: (guesses: number) => {
    switch (guesses) {
      case 1:
        return 'godlike!';
      case 2:
        return 'epic!';
      case 3:
        return 'nice!';
      case 4:
        return 'well done.';
      case 5:
        return 'you did it.';
      default:
        return 'lucky you.';
    }
  },
  LossTitle: 'You lose',
  WinSubtitle: (guesses: number) => `You won in ${guesses} guess${guesses === 1 ? '' : 'es'}`,
  LossSubtitle: 'Better luck next time',
  TheAnswerWas: 'The answer was',
  ShareGameMessage: 'Share this game with your friends!',
  ConfirmationDefaultTitle: 'Are you sure?',
  ConfirmationCancel: 'Cancel',
  ConfirmationConfirm: 'OK',
  GameTypeWordle: 'Wordle',
  GameTypeRandom: 'Random',
  GameTypeRandomNew: 'Random+',
  ChangeGameType: 'If you switch game types, your progress in the current game will be lost!',
  StartANewGameButton: "New game",
  StartANewGameTitle: 'Do you want to start a new game',
  StartANewGame: 'If you start a new game, your progress in the current game will be lost!',
  ShareGame: 'Copy to share',
  Copied: 'Copied!',
  GuessesUsed: 'Guesses used',
  Statistics: 'Your overall measure of success in life',
  GamesPlayed: 'Played',
  WinPct: 'Win %',
  CurrentStreak: 'Current streak',
  MaxStreak: 'Max streak',
  GuessDistribution: 'Guess distribution',
};
