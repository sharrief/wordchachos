import { CheckCircle, Backspace } from '@material-ui/icons';
import { Row, Spinner } from 'react-bootstrap';
import { Key } from 'components/Key';
import { Board, KeyState } from 'types';

export function KeyBoard(props: {
  clickedLetter: (letter: string) => void;
  clickedBackspace: () => void;
  clickedEnter: () => void;
  getLetterGuessState: (letter: string) => KeyState;
  busy: boolean;
  readyToSubmit: boolean;
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
    board, guessIndex,
  } = props;
  const guess = board?.[guessIndex]?.squares?.map(({ letter }) => letter) || [];
  return <>
    <Row className='justify-content-center d-flex flex-nowrap mx-1'>
      {'QWERTYUIOP'.split('').map((key) => <Key active={guess.includes(key)} key={key} label={key} value={key} onClick={clickedLetter} guessState={getLetterGuessState(key)} />)}
    </Row>
    <Row className='justify-content-center d-flex flex-nowrap mx-1'>
      {'ASDFGHJKL'.split('').map((key) => <Key active={guess.includes(key)} key={key} label={key} value={key} onClick={clickedLetter} guessState={getLetterGuessState(key)} />)}
    </Row>
    <Row className='justify-content-center d-flex flex-nowrap mx-1'>
      <Key key={'submitAttempt'} canPress={readyToSubmit} label={busy ? <Spinner animation='grow'/> : <CheckCircle />} value={''} onClick={clickedEnter} className={readyToSubmit ? 'bg-success text-dark' : ''}/>
      {'ZXCVBNM'.split('').map((key) => <Key active={guess.includes(key)} key={key} label={key} value={key} onClick={clickedLetter} guessState={getLetterGuessState(key)} />)}
      <Key key={'backspace'} value={''} canPress={canBackspace} label={<Backspace />} onClick={clickedBackspace} />
    </Row>
  </>;
}
