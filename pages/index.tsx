import type { NextPage } from 'next'
import Head from 'next/head'
import { Alert, Button, ButtonGroup, Container, Spinner, ToggleButton } from 'react-bootstrap'
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { GameBoard, EndScreen, KeyBoard, Navigation } from '@components';
import { KeyState, GameState, Game, GameType } from '@types';
import { initGame, addLetter, removeLetter } from "game";
import { api } from 'pages/api/_api';
import { Confirmation } from 'components/Comfirmation';
import { Labels } from '@messages';

async function fetchAPI(apiName: string, data: any) {
  const res = await fetch(`/api/${apiName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const { ok } = res;
  if (ok) {
    const responseData = await res.json();
    return responseData;
  }
  return {};
}

const Home: NextPage<{ game: Game }> = ({ game: initialGame }) => {
  const [game, setGame] = useState<Game>(initialGame);
  const { state, board, guessLength, guessIndex, squareIndex, type } = game;

  const [newGameType, setNewGameType] = useState<GameType>();
  const handleChangeGameType = async () => {
    if (newGameType != null && newGameType !== type) {
      const { data: newGame, error } = await api.initGame({ gameType: newGameType });
      if (error) { setErrorMsg(error); }
      if (newGame?.board) {
        setGame({ ...newGame });
      }
      setNewGameType(undefined);
    }
  };
  const handleCloseChangeGameType = () => setNewGameType(undefined);

  const [newRandomGame, setNewRandomGame] = useState(false);
  const handleNewRandomGame = async () => {
    setBusy(true);
    if (type === GameType.random && newRandomGame === true) {
      const { data: newGame, error } = await api.initGame({ gameType: GameType.random });
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
    if (game.state !== GameState.active || busy) return;
    const updatedGame = addLetter(letter, game);
    setGame({ ...updatedGame });
  }
  const clickedBackspace = async () => {
    if (game.state !== GameState.active || busy) return;
    const updatedGame = removeLetter(game);
    setGame({ ...updatedGame });
  }
  const clickedEnter = async () => {
    if (game.state !== GameState.active) {
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
    <div className='h-100 d-flex flex-column justify-content-between'>
      <Head>
        <title>Wordchachos</title>
      </Head>
      <Confirmation
        show={newGameType != null}
        message={Labels.ChangeGameType}
        cancel={handleCloseChangeGameType}
        confirm={handleChangeGameType}
      />
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
      <Navigation />
      <Container fluid className='mx-auto mt-2 d-flex flex-row flex-wrap justify-content-center'>
        <ButtonGroup className='mb-2'>
          <Button
            variant={type === GameType.wordle ? 'secondary' : 'outline-secondary'}
            onClick={() => setNewGameType(GameType.wordle)}
          >
            {Labels.GameTypeWordle}
          </Button>
          <Button
            variant={type === GameType.random ? 'secondary' : 'outline-secondary'}
            onClick={handleClickNewGame}
          >
            {type === GameType.random ? Labels.GameTypeRandomNew : Labels.GameTypeRandom}
          </Button>
        </ButtonGroup>
        <GameBoard game={game} />
      </Container>
      </div>
      <Container className=''>
        <AnimatePresence>
          <motion.div
            key={`${busy}`}
            style={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: [1, 0] }}
          >
            {busy && <div className='d-flex justify-content-center mb-2' ><Spinner animation='border' /></div>}
          </motion.div>
        </AnimatePresence>
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
        <KeyBoard
          {...{
            clickedLetter,
            clickedBackspace,
            clickedEnter,
            getLetterGuessState: getKeyGuessState,
            board,
            guessIndex,
            readyToSubmit,
            canBackspace
          }}
        />
      </Container>
    </div>
  )
}

export async function getServerSideProps() {
  const game = await initGame(GameType.wordle);
  return { props: { game } }
}

export default Home
