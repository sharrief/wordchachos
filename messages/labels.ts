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
        return 'well done';
      case 5:
        return 'you did it';
      default:
        return 'lucky you';
    }
  },
  LossTitle: 'You lose',
  WinSubtitle: (guesses: number) => `You won in ${guesses} guesses`,
  LossSubtitle: 'Better luck next time',
  ShareGameMessage: 'Share this game with your friends!',
};
