import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Alert, Container, Modal, ProgressBar,
} from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ver from 'version';
import {
  GameBoard,
} from 'components/GameBoard';
import {
  EndScreen,
} from 'components/EndScreen';
import {
  KeyBoard,
} from 'components/KeyBoard';
import {
  Menu,

} from 'components/Menu';
import {
  KeyState, GameState, Game, GameType,
} from 'types';
import {
  addLetter,
} from 'game/addLetter';
import {
  removeLetter,
} from 'game/removeLetter';
import {
  getUninitializedGame,
} from 'game/initGame';
import {
  saveGame,
} from 'game/saveGame';
import {
  getMostRecentGame,
} from 'game/getMostRecentGame';
import { api } from 'pages/api/_api';
import { Labels } from 'messages/labels';
import { Errors } from 'messages/errors';
import useSWR from 'swr';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

const devLog = true;

const Home: NextPage = () => {
  const router = useRouter();
  const { gameType: gameRoute } = router.query;
  const gameType = (() => {
    if (gameRoute === 'wordOfTheDay') return GameType.WotD;
    if (gameRoute === 'wordle') return GameType.Wordle;
    return GameType.Random;
  })();

  const { data: version } = useSWR(['/getVersion'], async () => {
    console.log(Labels.CheckingForUpdate(ver));
    const { data } = await api.getVersion();
    if (data) {
      return data.version;
    }
    return data;
  });

  const [updatingApp, setUpdatingApp] = useState(false);
  useEffect(() => {
    if (version && ver !== version) {
      console.log(Labels.FoundUpdate(ver, version));
      setUpdatingApp(true);
      window.location.reload();
    }
  }, [version]);
  /** SWR will cache the seed using with key seedDate */
  const { data: todaysSeed } = useSWR(() => {
    const { year, month, day } = DateTime.local();
    return `getSeed for ${gameType} on ${month}/${day}/${year}`;
  }, async () => {
    const log = (msg: string) => devLog && console.log(`getSeedSWR: ${msg}`);
    const { year, month, day } = DateTime.local();
    log(`Fetching ${gameType} seed for ${month}/${day}/${year}`);
    const { data, error } = await api.getWotDSeed({
      year, month, day, gameType,
    });
    if (error || data == null) {
      throw new Error(error || Errors.CantGetSeed);
    }
    log(`${gameType} seed for ${month}/${day}/${year} is ${data}`);
    // setSeedDate({ year, month, day });
    return data;
  });

  /** Changing game type is used to trigger a loading the game from cache. See SWR hook below */
  /** The fetcher/callback is only fired when the newGameType changes, otherwise SWR returns the cached value from previous call */
  /** SWR won't call the fetcher/callback is the first function throws bc todaysSeed seed is undefined while its SWR is in process*/
  const { data, mutate: mutateGame } = useSWR(() => {
    if (gameType === GameType.Random) {
      /** Use the SWR key for the random game type */
      return [`${gameType}`, gameType];
    }
    /** No wordle game will be loaded until todays seed is fetched */
    if (todaysSeed == null) throw new Error('Seed not loaded');
    /** Use the SWT key for todays seed */
    return [`${gameType}-seed-${todaysSeed}`, gameType];
  }, async (_r, t) => {
    const log = (msg: string) => devLog && console.log(`getGameSWR: ${msg}`);
    try {
      const dt = DateTime.local();
      const { year, month, day } = dt;
      log(`Finding a ${t} game for ${month}/${day}/${year}`);
      /** Try to load from savedGames first */
      const savedGame = getMostRecentGame(t);
      if (savedGame) {
        log(`Saved game seed is ${savedGame.seed}. Todays is ${todaysSeed}`);
        if (t === GameType.Random || (todaysSeed === savedGame.seed)) {
          log('Returning saved game');
          return { game: savedGame as Game, error: '' };
        }
      }
      /** No saved games (with todays seed, for wordle...) found for the GameType, so Initialize a new game */
      /** For random games, after the first such call to this SWR, new random games will be started by handleNewRandomGame */
      log(`Starting a new game with seed date ${month}/${day}/${year}`);
      const today = { year, month, day };
      const { data: game, error } = await api.initGame({ gameType: t ?? GameType.WotD, date: today });
      if (game) {
        log(`Saving the new game with seed ${game.seed}`);
        saveGame(game);
      }
      return { error, game: game as Game };
    } catch ({ message }) {
      return { error: message as string, game: undefined as unknown as Game };
    }
  });
  const setGame = (newGame: Game) => {
    /** Save game state to local storage */
    saveGame(newGame);
    /** trigger reload of the game through SWR */
    mutateGame();
  };
  // const [game, setGame] = useState<Game>(initialGame);
  const game = data?.game || getUninitializedGame(gameType);
  const {
    state, board, guessIndex,
  } = game;

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEndScreen, setShowEndScreen] = useState(false);
  const handleNewRandomGame = async () => {
    setBusy(true);
    if (gameType === GameType.Random) {
      const { year, month, day } = DateTime.local();
      const { data: newGame, error } = await api.initGame({ gameType: GameType.Random, date: { year, month, day } });
      if (error) { setErrorMsg(error); }
      if (newGame?.board) {
        setGame({ ...newGame });
      }
      setShowEndScreen(false);
    }
    setBusy(false);
  };

  const handleClickNewGame = () => {
    setShowEndScreen(false);
    handleNewRandomGame();
  };
  useEffect(() => {
    if (game.type === GameType.WotD && game.seed !== todaysSeed) {
      setShowEndScreen(false);
    }
  }, [game, todaysSeed]);
  useEffect(() => {
    if (state && state !== GameState.active) { setShowEndScreen(true); }
  }, [state]);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => setErrorMsg(''), 1000);
    }
  }, [errorMsg]);
  useEffect(() => {
    if (busy) { setErrorMsg(''); }
  }, [busy]);
  const closeError = () => setErrorMsg('');

  const handleResponse = (res: { data?: Game, error: string }) => {
    const { data: newGame, error } = res;
    if (error) { setErrorMsg(error); }
    if (newGame) {
      setGame({ ...newGame });
    }
  };
  const clickedLetter = (letter: string) => {
    if (state !== GameState.active || busy) return;
    const updatedGame = addLetter(letter, game);
    setGame({ ...updatedGame });
  };
  const clickedBackspace = async () => {
    if (state !== GameState.active || busy) return;
    const updatedGame = removeLetter(game);
    setGame({ ...updatedGame });
  };
  const clickedEnter = async () => {
    if (state !== GameState.active) {
      setShowEndScreen(true);
    } else if (!busy && game.squareIndex === game.guessLength) {
      setBusy(true);
      const res = await api.submitGuess({ game });
      handleResponse(res);
      setBusy(false);
    }
  };

  const getKeyGuessState = (letter: string) => board
    .filter((_, gI) => gI < guessIndex)
    .reduce((stateForCurrentKey, guess) => {
      if (stateForCurrentKey === KeyState.Position) return stateForCurrentKey;
      const matchingSquare = guess.squares.find((square) => square.letter === letter);
      if (matchingSquare) {
        return matchingSquare.state;
      }
      return stateForCurrentKey;
    }, KeyState.Unused as KeyState);

  return (

    <div className='h-100 d-flex flex-column justify-content-between'>
      <Head>
        <title>{Labels.SiteTitle}</title>
      </Head>
      <EndScreen
        show={showEndScreen}
        game={game}
        onHide={() => setShowEndScreen(false)}
        handleNewRandomGame={handleClickNewGame}
      />
      <div className='fixed-top mt-5'>
        <AnimatePresence>
          <motion.div
            key={errorMsg}
            style={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: [1, 0] }}
          >
            {errorMsg !== '' && <Alert variant='danger' onClose={closeError} dismissible>{errorMsg}</Alert>}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            style={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: [1, 0] }}
          >
            {updatingApp
              && <Modal show={updatingApp} centered>
                <Modal.Header><h2>{Labels.Updating}</h2></Modal.Header>
                <Modal.Body>
                  <p>{Labels.NewVersion}</p>
                  <p>v{ver} {'--->'} v{version}</p>
                  <ProgressBar variant='warning' animated now={100} />
                  </Modal.Body>
              </Modal>
            }
          </motion.div>
        </AnimatePresence>
      </div>
      <div>
        <Menu game={game} seed={todaysSeed} />
        <Container fluid className='mx-auto mt-2 d-flex flex-row flex-wrap justify-content-center'>
          <GameBoard game={game} />
        </Container>
      </div>
      <KeyBoard
        {...{
          clickedLetter,
          clickedBackspace,
          clickedEnter,
          getLetterGuessState: getKeyGuessState,
          game,
          busy,
        }}
      />
    </div>
  );
};

export default Home;
