import type { NextPage } from 'next'
import Head from 'next/head'
import { Alert, Button, ButtonGroup, Container, Spinner, ToggleButton } from 'react-bootstrap'
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { GameBoard, EndScreen, KeyBoard, Menu } from '@components';
import { KeyState, GameState, Game, GameType } from '@types';
import { initGame, addLetter, removeLetter, getEmptyGame, saveActiveGame } from "game";
import { api } from 'pages/api/_api';
import { Confirmation } from 'components/Comfirmation';
import { Labels } from '@messages';
import useSWR, { SWRConfig } from 'swr';
import { getActiveGame } from 'game/getActiveGame';
import { DateTime } from 'luxon';

const Home: NextPage = () => {

  const { year, month, day } = DateTime.local();
  const date = { year, month, day };
  /** Stringifying today's date so that SWR uses it as a key to cache todays seed - when tomorrow comes SWR will fetch for a new seed */
  const { data: todaysSeed } = useSWR(['getWordleSeed', JSON.stringify(date)], async (_r, _dateString) => {
    const { data } = await api.getWordleSeed(date);
    return data;
  });

  /** Changing game type is used to trigger a loading the game from cache. See SWR hook below */
  const [newGameType, setNewGameType] = useState<GameType>();
  /** The fetcher/callback is only fired when the newGameType changes, otherwise SWR returns the cached value from previous call */
  const { data, error, mutate } = useSWR(['getGame', newGameType, JSON.stringify(date)], async (_r, gameType) => {
    try {
      /** Try to load from savedGames first */
      const savedGame = getActiveGame(gameType);
      if (savedGame) {
        if (gameType !== GameType.wordle || (todaysSeed === savedGame.seed))
          return { game: savedGame as Game, error: '' };
          if (!todaysSeed) {
            const { data: seed } = await api.getWordleSeed(date);
            if (seed === savedGame.seed) return { game: savedGame as Game, error: '' };
          }
      }
      /** No saved games (with todays seed, for wordle...) found for the GameType, so Initialize a new game */
      /** For random games, after the first such call to this SWR, new random games will be started by handleNewRandomGame */
      const { data: game, error } = await api.initGame({ gameType: gameType ?? GameType.wordle, date })
      if (game) { saveActiveGame(game); }
      return { error, game: game as Game }  ;
    } catch ({ message }) {
      return { error: message as string, game: undefined as unknown as Game }
    }
  });
  const setGame = (newGame: Game) => {
    /** Save game state to local storage */
    saveActiveGame(newGame);
    /** trigger reload of the game through SWR */
    mutate();
  }
  // const [game, setGame] = useState<Game>(initialGame);
  const game = data?.game || getEmptyGame(newGameType);
  const { state, board, guessLength, guessIndex, squareIndex, type, answer } = game;

  const [newRandomGame, setNewRandomGame] = useState(false);
  const handleNewRandomGame = async () => {
    setBusy(true);
    if (type === GameType.random && newRandomGame === true) {
      const { data: newGame, error } = await api.initGame({ gameType: GameType.random, date });
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

  let win = state === GameState.win;
  let loss = state === GameState.loss;
  useEffect(() => {
    if (win || loss)
      setShowEndScreen(true);
  }, [win, loss])
  const [showEndScreen, setShowEndScreen] = useState(false);

  const readyToSubmit = squareIndex === guessLength;
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
        revalidateOnFocus: false,
        revalidateOnMount: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
      }}
    >
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
          <Menu game={game} setGameType={setNewGameType} />
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
