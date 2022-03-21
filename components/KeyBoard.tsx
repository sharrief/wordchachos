import {
  CheckCircle, Backspace, AddCircle,
} from '@material-ui/icons';
import { Spinner } from 'react-bootstrap';
import { Key } from 'components/Key';
import {
  Board,
  Game, GameState, GameType, KeyState,
} from 'types';
import { useEffect } from 'react';
import { Labels } from 'messages/labels';

const getKeyGuessState = (letter: string, board: Board, guessIndex: number) => board
  .filter((_, gI) => gI < guessIndex)
  .reduce((stateForCurrentKey, guess) => {
    if (stateForCurrentKey === KeyState.Position) return stateForCurrentKey;
    const matchingSquare = guess.squares.find((square) => square.letter === letter);
    if (matchingSquare) {
      return matchingSquare.state;
    }
    return stateForCurrentKey;
  }, KeyState.Unused as KeyState);

export function KeyBoard(props: {
  clickedLetter: (letter: string) => void;
  clickedBackspace: () => void;
  clickedEnter: () => void;
  busy: boolean;
  game: Game;
  captureKeyPress: boolean;
}) {
  const {
    clickedLetter,
    clickedBackspace,
    clickedEnter, busy,
    game, captureKeyPress,
  } = props;
  const {
    board, guessIndex, squareIndex, guessLength, state, type,
  } = game;
  const readyToSubmit = (squareIndex === guessLength);
  const canBackspace = squareIndex > 0;
  const gameOver = state !== GameState.active;
  const canNewGame = gameOver && type === GameType.random;
  const guess = board?.[guessIndex]?.squares?.map(({ letter }) => letter) || [];
  const rowClass = 'justify-content-between d-flex mb-2';
  const firstRowLetters = 'qwertyuiop';
  const secondRowLetters = 'asdfghjkl';
  const thirdRowLetters = 'zxcvbnm';
  const allLetters = `${firstRowLetters}${secondRowLetters}${thirdRowLetters}`;
  const handleKeyPress = (event: KeyboardEvent) => {
    if (captureKeyPress) {
      if (allLetters.includes(event.key.toLowerCase())) {
        clickedLetter(event.key.toUpperCase());
      }
      if (event.key === 'Enter') clickedEnter();
      if (event.key === 'Backspace') clickedBackspace();
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });
  return <div className='d-flex flex-column w-100'>
    <div className={rowClass}>
      {'QWERTYUIOP'.split('').map((key) => <Key
        active={guess.includes(key)}
        key={key}
        label={key}
        value={key}
        onClick={clickedLetter}
        guessState={getKeyGuessState(key, board, guessIndex)}
      />)}
    </div>
    <div className={rowClass}>
      <div style={{ flex: 0.5 }}></div>
      {'ASDFGHJKL'.split('').map((key) => <Key
        active={guess.includes(key)}
        key={key} label={key}
        value={key}
        onClick={clickedLetter}
        guessState={getKeyGuessState(key, board, guessIndex)} />)}
      <div style={{ flex: 0.5 }}></div>
    </div>
    <div className={rowClass}>
      <Key
        action='enter'
        actionEnabled={readyToSubmit || gameOver}
        // eslint-disable-next-line no-nested-ternary
        label={busy
          ? <Spinner animation='grow' />
          : canNewGame ? <><span className='d-none d-md-flex me-1'>{Labels.StartANewGameButton}</span><AddCircle /></>
            : <CheckCircle />}
        value={canNewGame ? 'new' : ''}
        onClick={clickedEnter} />
      {'ZXCVBNM'.split('').map((key) => <Key
        active={guess.includes(key)}
        key={key}
        label={key}
        value={key}
        onClick={clickedLetter}
        guessState={getKeyGuessState(key, board, guessIndex)} />)}
      <Key
        value={''}
        action='delete'
        actionEnabled={canBackspace}
        label={<Backspace />}
        onClick={clickedBackspace} />
    </div>
  </div>;
}
