import {
  CheckCircle, Backspace, Add,
} from '@material-ui/icons';
import { Spinner } from 'react-bootstrap';
import { Key } from 'components/Key';
import { Board, KeyState } from 'types';
import { useEffect } from 'react';
import { Labels } from 'messages/labels';

export function KeyBoard(props: {
  clickedLetter: (letter: string) => void;
  clickedBackspace: () => void;
  clickedEnter: () => void;
  getLetterGuessState: (letter: string) => KeyState;
  busy: boolean;
  readyToSubmit: boolean;
  gameOver: boolean;
  canBackspace: boolean;
  board: Board;
  guessIndex: number;
}) {
  const {
    clickedLetter,
    clickedBackspace,
    clickedEnter, busy,
    getLetterGuessState,
    readyToSubmit, canBackspace,
    board, guessIndex, gameOver,
  } = props;
  const guess = board?.[guessIndex]?.squares?.map(({ letter }) => letter) || [];
  const rowClass = 'justify-content-between d-flex mb-2';
  const firstRowLetters = 'qwertyuiop';
  const secondRowLetters = 'asdfghjkl';
  const thirdRowLetters = 'zxcvbnm';
  const allLetters = `${firstRowLetters}${secondRowLetters}${thirdRowLetters}`;
  const handleKeyPress = (event: KeyboardEvent) => {
    if (allLetters.includes(event.key.toLowerCase())) {
      clickedLetter(event.key.toUpperCase());
    }
    if (event.key === 'Enter') clickedEnter();
    if (event.key === 'Backspace') clickedBackspace();
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
        guessState={getLetterGuessState(key)}
      />)}
    </div>
    <div className={rowClass}>
      <div style={{ flex: 0.5 }}></div>
      {'ASDFGHJKL'.split('').map((key) => <Key
        active={guess.includes(key)}
        key={key} label={key}
        value={key}
        onClick={clickedLetter}
        guessState={getLetterGuessState(key)} />)}
      <div style={{ flex: 0.5 }}></div>
    </div>
    <div className={rowClass}>
      <Key
        action='enter'
        actionEnabled={readyToSubmit}
        // eslint-disable-next-line no-nested-ternary
        label={busy ? <Spinner animation='grow' /> : gameOver ? <>{Labels.StartANewGameButton} <Add /></> : <CheckCircle />}
        value={gameOver ? 'new' : ''}
        onClick={clickedEnter} />
      {'ZXCVBNM'.split('').map((key) => <Key
        active={guess.includes(key)}
        key={key}
        label={key}
        value={key}
        onClick={clickedLetter}
        guessState={getLetterGuessState(key)} />)}
      <Key
        value={''}
        action='delete'
        actionEnabled={canBackspace}
        label={<Backspace />}
        onClick={clickedBackspace} />
    </div>
  </div>;
}
