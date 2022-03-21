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
  GameState, Game, GameType,
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
  saveGameToCache,
} from 'localStorage/saveGameToCache';
import { api } from 'pages/api/_api';
import { Labels } from 'messages/labels';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useUser } from 'data/useUser';
import { useCurrentGame } from 'data/useCurrentGame';
import { useTodaysSeed } from 'data/useTodaysSeed';
import { useVersion } from 'data/useVersion';
import { getGuessString } from 'game/guess';
import { submitGuess } from 'game/submitGuess';

const Home: NextPage = () => {
  const router = useRouter();
  const { gameType: gameRoute } = router.query;
  const gameType = gameRoute === 'random' ? GameType.random : GameType.wordle;

  const [updatingApp, setUpdatingApp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: version } = useVersion(ver);
  useEffect(() => {
    if (version && ver !== version) {
      console.log(Labels.FoundUpdate(ver, version));
      setUpdatingApp(true);
      window.location.reload();
    }
  }, [version]);
  const { data: user } = useUser();
  const { data: todaysSeed } = useTodaysSeed(DateTime.local());
  const { data, error: useGameError, mutate: mutateGame } = useCurrentGame(user, gameType, todaysSeed ?? -1);
  useEffect(() => {
    if (useGameError) {
      setErrorMsg(useGameError);
      console.log(useGameError);
    }
  }, [useGameError]);
  const setGame = (newGame: Game) => {
    /** Save game state to local storage */
    saveGameToCache(newGame);
    /** trigger reload of the game through SWR */
    mutateGame(newGame, { revalidate: false });
  };
  // const [game, setGame] = useState<Game>(initialGame);
  const game = data ?? getUninitializedGame(gameType);
  const {
    state, board, guessIndex, _id,
  } = game;
  const isCloudGame = !!_id;
  const [busy, setBusy] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (game?.state === GameState.active || game.seed < 0 || (game.type === GameType.wordle && game.seed !== todaysSeed)) {
      setShowEndScreen(false);
    }
  }, [game, todaysSeed]);
  useEffect(() => {
    if (game.seed != null && game.state !== GameState.active) {
      setShowEndScreen(true);
    }
  }, [game]);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => setErrorMsg(''), 2000);
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
  const handleNewRandomGame = async () => {
    setBusy(true);
    const { year, month, day } = DateTime.local();
    const res = await api.fetchNewGame({ gameType: GameType.random, date: { year, month, day } });
    handleResponse(res);
    setShowEndScreen(false);
    setBusy(false);
  };

  const clickedNewGame = () => {
    setShowEndScreen(false);
    handleNewRandomGame();
  };

  const clickedLetter = async (letter: string) => {
    if (!game?.board || (state !== GameState.active || busy)) return;
    const updatedGame = addLetter(letter, game);
    setGame({ ...updatedGame });
  };
  const clickedBackspace = async () => {
    if (!game?.board || (state !== GameState.active || busy)) return;
    const updatedGame = removeLetter(game);
    setGame({ ...updatedGame });
  };
  const clickedEnter = async () => {
    if (state !== GameState.active) {
      setShowEndScreen(true);
    } else if (!busy && game.squareIndex === game.guessLength) {
      setBusy(true);
      if (user && isCloudGame) {
        const res = await api.postGuess({ gameType, guessString: getGuessString(board[guessIndex]) });
        handleResponse(res);
      } else {
        const updatedGame = submitGuess(game);
        setGame({ ...updatedGame });
      }
      setBusy(false);
    }
  };
  return (

    <div className='h-100 d-flex flex-column justify-content-between'>
      <Head>
        <title>{Labels.SiteTitle}</title>
      </Head>
      <EndScreen
        show={showEndScreen}
        game={game}
        onHide={() => setShowEndScreen(false)}
        handleNewRandomGame={clickedNewGame}
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
        <Menu game={game} seed={todaysSeed} setOpen={(open) => setMenuOpen(open)}/>
        <Container fluid className='mx-auto mt-2 d-flex flex-row flex-wrap justify-content-center'>
          <GameBoard game={game} />
        </Container>
      </div>
      <KeyBoard
        {...{
          captureKeyPress: !menuOpen,
          clickedLetter,
          clickedBackspace,
          clickedEnter,
          game,
          busy,
        }}
      />
    </div>
  );
};

export default Home;
