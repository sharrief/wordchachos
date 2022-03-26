export const Labels = {
  SiteTitle: 'wordchachos!',
  PrivacyPolicy: 'Privacy',
  GitHub: 'Github',
  SignInTitle: 'Sign in to WORDCHACHOS!',
  SignIn: 'Sign in',
  SignedInAs: (name: string) => `Signed in as ${name}`,
  SignOut: 'Sign out',
  SignInFor: 'Sign in to keep track of your games across devices!',
  Name: 'Cool name',
  NamePlaceholder: 'Enter a cool name (or your own name)',
  IHaveAnAcconut: 'I already have an account',
  Passphrase: 'Cool passphrase',
  NewPassphrasePlaceholder: 'We will create a cool one for you',
  PassphrasePlaceholder: 'Enter the cool passphrase we created for you',
  DoSignIn: 'Go!',
  Updating: 'Updating...',
  UploadYourGames: 'Sync your games!',
  ToUploadGameCount: (localWordle: number, localRandom: number, cloud: number) => `You have ${localWordle} wordle and ${localRandom} random games to upload. ${cloud} games are already in the cloud.`,
  UploadGameCount: (count: number) => `Uploading ${count} games...`,
  UploadedGameCount: (count: number) => `We've saved ${count} games to the cloud. You can now sign in to other devices using the cool name and cool passphrase above to play.`,
  UploadDone: 'Done!',
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
  Copy: 'Copy',
  Copied: 'Copied!',
  GuessesUsed: 'Guesses used',
  Statistics: 'Statistics',
  StatisticsSubtitle: 'Summary',
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
