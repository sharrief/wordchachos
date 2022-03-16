import type { NextPage } from 'next'
import Head from 'next/head'
import { Alert, Container } from 'react-bootstrap'
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { GameBoard, EndScreen, KeyBoard, Menu } from '@components';
import { KeyState, GameState, Game, GameType } from '@types';
import { addLetter, removeLetter, getEmptyGame, getSavedGames, saveGame, getMostRecentGame } from "game";
import { api } from 'pages/api/_api';
import { Confirmation } from '@components';
import { Errors, Labels } from '@messages';
import useSWR, { SWRConfig } from 'swr';
import { DateTime } from 'luxon';

const Home: NextPage = () => {
  /** SWR will cache the seed using with key seedDate */
  const { data: todaysSeed } = useSWR(
    () => {
      const { year, month, day } = DateTime.local();
      return `getWordleSeed for ${month}/${day}/${year}`
    }, async (_r) => {
      const log = (msg: string) => console.log(`getWordleSeedSWR: ${msg}`);
      const { year, month, day } = DateTime.local();
      log(`Fetching wordle seed for ${month}/${day}/${year}`);
      const { data, error } = await api.getWordleSeed({ year, month, day });
      if (error || data == null) {
        throw new Error(error || Errors.CantGetSeed);
      }
      log(`Wordle seed for ${month}/${day}/${year} is ${data}`);
      // setSeedDate({ year, month, day });
      return data;
    });
  /** Changing game type is used to trigger a loading the game from cache. See SWR hook below */
  const [newGameType, setNewGameType] = useState<GameType>(GameType.wordle);
  /** The fetcher/callback is only fired when the newGameType changes, otherwise SWR returns the cached value from previous call */
  /** SWR won't call the fetcher/callback is the first function throws bc todaysSeed seed is undefined while its SWR is in process*/
  const { data, error, mutate: mutateGame } = useSWR(() => {
    if (newGameType === GameType.random) {
       /** Use the SWR key for the random game type */
      return [`${newGameType}`, newGameType];
    }
    /** No wordle game will be loaded until todays seed is fetched */
    if (todaysSeed == null) throw new Error('Seed not loaded');
    /** Use the SWT key for todays wordle see */
    return [`${newGameType}-seed-${todaysSeed}`, newGameType];
  }, async (_r, gameType) => {
    const log = (msg: string) => console.log(`getGameSWR: ${msg}`);
    try {
      const dt = DateTime.local();
      const { year, month, day } = dt;
      log(`Finding a game for ${month}/${day}/${year}`)
      /** Try to load from savedGames first */
      const savedGame = getMostRecentGame(gameType);
      if (savedGame) {
        log(`Saved game seed is ${savedGame.seed}. Todays is ${todaysSeed}`)
        if (gameType === GameType.random || (todaysSeed === savedGame.seed)) {
          log('Returning saved game')
          return { game: savedGame as Game, error: '' };
        }
      }
      /** No saved games (with todays seed, for wordle...) found for the GameType, so Initialize a new game */
      /** For random games, after the first such call to this SWR, new random games will be started by handleNewRandomGame */
      log(`Starting a new game with seed date ${month}/${day}/${year}`);
      const today = { year, month, day }
      const { data: game, error } = await api.initGame({ gameType: gameType ?? GameType.wordle, date: today })
      if (game) {
        log(`Saving the new game with seed ${game.seed}`);
        saveGame(game);
      }
      return { error, game: game as Game };
    } catch ({ message }) {
      return { error: message as string, game: undefined as unknown as Game }
    }
  });
  const setGame = (newGame: Game) => {
    /** Save game state to local storage */
    saveGame(newGame);
    /** trigger reload of the game through SWR */
    mutateGame();
  }
  // const [game, setGame] = useState<Game>(initialGame);
  const game = data?.game || getEmptyGame(newGameType);
  const { state, board, guessLength, guessIndex, squareIndex, type, answer } = game;

  const [newRandomGame, setNewRandomGame] = useState(false);
  const handleNewRandomGame = async () => {
    setBusy(true);
    if (type === GameType.random && newRandomGame === true) {
      const { year, month, day } = DateTime.local();
      const { data: newGame, error } = await api.initGame({ gameType: GameType.random, date: { year, month, day } });
      if (error) { setErrorMsg(error); }
      if (newGame?.board) {
        setGame({ ...newGame });
      }
      setNewRandomGame(false);
      setShowEndScreen(false);
    }
    setBusy(false);
  }
  const handleCloseNewRandomGame = () => setNewRandomGame(false);

  const handleClickNewGame = () => {
    setShowEndScreen(false);
    if (type === GameType.random) {
      setNewRandomGame(true);
    } else {
      setNewGameType(GameType.random);
    }
  }
  const [showEndScreen, setShowEndScreen] = useState(false);
  useEffect(() => {
    if (game.type === GameType.wordle && game.seed !== todaysSeed) {
      setShowEndScreen(false);
    }
  }, [game]);
  let win = state === GameState.win;
  let loss = state === GameState.loss;
  useEffect(() => {
    if (win || loss)
      setShowEndScreen(true);
  }, [win, loss])

  const readyToSubmit = (squareIndex === guessLength || win || loss);
  const canBackspace = squareIndex > 0;
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => setErrorMsg(''), 1000);
    }
  }, [errorMsg])
  useEffect(() => {
    if (busy) { setErrorMsg(''); }
  }, [busy])
  const closeError = () => setErrorMsg('');

  const handleResponse = (res: { data?: Game, error: string }) => {
    const { data: newGame, error } = res;
    if (error) { setErrorMsg(error); }
    if (newGame) {
      setGame({ ...newGame });
    }
  }
  const clickedLetter = (letter: string) => {
    if (state !== GameState.active || busy) return;
    const updatedGame = addLetter(letter, game);
    setGame({ ...updatedGame });
  }
  const clickedBackspace = async () => {
    if (state !== GameState.active || busy) return;
    const updatedGame = removeLetter(game);
    setGame({ ...updatedGame });
  }
  const clickedEnter = async () => {
    if (state !== GameState.active) {
      setShowEndScreen(true);
    } else if (!busy && readyToSubmit) {
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
      };
      return stateForCurrentKey;
    }, KeyState.Unused as KeyState);

  return (
    <SWRConfig
    value={{
      revalidateIfStale: false, 
      revalidateOnFocus: false, 
      revalidateOnReconnect: false 
    }}>
      <div className='h-100 d-flex flex-column justify-content-between'>
        <Head>
          <title>{Labels.SiteTitle}</title>
        </Head>
        {/* <Confirmation
        show={newGameType != null}
        message={Labels.ChangeGameType}
        cancel={handleCloseChangeGameType}
        confirm={handleChangeGameType}
      /> */}
        <Confirmation
          show={newRandomGame === true}
          message={Labels.StartANewGameTitle}
          cancel={handleCloseNewRandomGame}
          confirm={handleNewRandomGame}
        />
        <EndScreen
          show={showEndScreen}
          game={game}
          onHide={() => setShowEndScreen(false)}
          handleNewRandomGame={handleClickNewGame}
        />
        <div>
          <Menu game={game} setGameType={setNewGameType} seed={todaysSeed} />
          <Container fluid className='mx-auto mt-2 d-flex flex-row flex-wrap justify-content-center'>
            <GameBoard game={game} />
          </Container>
        </div>
        <Container className=''>
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
          </div>
          <KeyBoard
            {...{
              clickedLetter,
              clickedBackspace,
              clickedEnter,
              getLetterGuessState: getKeyGuessState,
              board,
              guessIndex,
              readyToSubmit,
              canBackspace,
              busy,
            }}
          />
        </Container>
      </div>
    </SWRConfig>
  )
}

export default Home
