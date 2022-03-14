import type { NextPage } from 'next'
import Head from 'next/head'
import { Alert, ButtonGroup, Container, Spinner, ToggleButton } from 'react-bootstrap'
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
  const { state, board, answer, guessLength, guessIndex, squareIndex, type } = game;
  const [newGameType, setNewGameType] = useState<GameType>();
  const handleChangeGameType = async () => {
    if (newGameType != null) {
      const { data: newGame, error } = await api.initGame({ gameType: newGameType });
      if (error) { setErrorMsg(error); }
      if (newGame?.board) {
        setGame({ ...newGame });
      }
      setNewGameType(undefined);
    }
  };
  const handleCloseConfirm = () => setNewGameType(undefined);
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
    <div className='vh-100'>
      <Head>
        <title>Wordchachos</title>
      </Head>
      <Navigation />
      <Confirmation
        show={newGameType != null}
        message={Labels.ChangeGameType}
        cancel={handleCloseConfirm}
        confirm={handleChangeGameType}
      />
      <EndScreen
        show={showEndScreen}
        win={win}
        loss={loss}
        onHide={() => setShowEndScreen(false)}
        guesses={guessIndex}
        answer={answer}
      />
      <Container fluid className='mx-auto mt-2 d-flex flex-row flex-wrap justify-content-center'>
        <ButtonGroup className='mb-2'>
          <ToggleButton
            id={`radio-${GameType.wordle}`}
            type="radio"
            variant={'outline-secondary'}
            name={"radio-wordle"}
            value={GameType.wordle}
            checked={type === GameType.wordle}
            onChange={() => setNewGameType(GameType.wordle)}
          >
            {Labels.GameTypeWordle}
          </ToggleButton>
          <ToggleButton
            id={`radio-${GameType.random}`}
            type="radio"
            variant={'outline-secondary'}
            name={"radio-random"}
            value={GameType.random}
            checked={type === GameType.random}
            onChange={() => setNewGameType(GameType.random)}
          >
            {Labels.GameTypeRandom}
          </ToggleButton>
        </ButtonGroup>
        <GameBoard game={game} />
      </Container>
      <Container className='fixed-bottom '>
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
