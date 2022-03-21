export const Labels = {
  SiteTitle: 'wordchachos!',
  PrivacyPolicy: 'Privacy policy',
  GitHub: 'Github',
  SignIn: 'Sign in to WORDCHACHOS!',
  SignInFor: 'Sign in to keep track of your games across devices and compete with your friends!',
  Name: 'Cool name',
  NamePlaceholder: 'Enter a cool name (or your own name)',
  Passphrase: 'Cool passphrase',
  PassphrasePlaceholder: 'We will create a cool one for you',
  DoSignIn: 'Go!',
  Updating: 'Updating...',
  NewVersion: 'A new version of the app is ready! Your browser is refreshing to get the update. Just a sec...',
  CheckingForUpdate: (current: string) => `Current version is v${current}. Checking for update.`,
  FoundUpdate: (current: string, update: string) => `A new update is ready. v${current} -> v${update}`,
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
  ShareGameMessage: 'Share your score with your friends!',
  ConfirmationDefaultTitle: 'Are you sure?',
  ConfirmationCancel: 'Cancel',
  ConfirmationConfirm: 'OK',
  GameTypeWordle: 'Wordle',
  GameTypeRandom: 'Random',
  GameTypeRandomNew: 'Random+',
  ChangeGameType: 'If you switch game types, your progress in the current game will be lost!',
  StartANewGameButton: 'New game',
  StartANewGameTitle: 'Do you want to start a new game',
  StartANewGame: 'If you start a new game, your progress in the current game will be lost!',
  ShareGame: 'Copy to share',
  Copied: 'Copied!',
  GuessesUsed: 'Guesses used',
  Statistics: 'Statistics',
  StatisticsSubtitle: 'Keep it going!',
  GameHistory: 'Game history',
  GamesPlayed: 'Games',
  GPG: 'GPG',
  GuessesSaved: 'Score',
  PPG: 'PPG',
  WinPct: 'Win %',
  CurrentStreak: 'Streak',
  MaxStreak: 'Max',
  GuessDistribution: 'Breakdown',
  Options: 'Options',
  ChooseGameType: 'Which word(s) do you want to solve?',
};
