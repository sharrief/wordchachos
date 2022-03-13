import { CheckCircle, Backspace } from "@material-ui/icons";
import { Container, Row } from "react-bootstrap";
import { Key } from "./Key";
import { KeyState } from '../types';

export function KeyBoard(props: {
  clickedLetter: (letter: string) => void;
  clickedBackspace: () => void;
  clickedEnter: () => void;
  getLetterGuessState: (letter: string) => KeyState;
  readyToSubmit: boolean;
  canBackspace: boolean;
}) {
  const {
    clickedLetter, 
    clickedBackspace, 
    clickedEnter,
    getLetterGuessState,
    readyToSubmit, canBackspace } = props;
  return <>
  <Row className='justify-content-center d-flex flex-nowrap mx-1'>
    {'QWERTYUIOP'.split('').map((key) =>
      <Key key={key} label={key} value={key} onClick={clickedLetter} guessState={getLetterGuessState(key)} />
    )}
  </Row>
  <Row className='justify-content-center d-flex flex-nowrap mx-1'>
    {'ASDFGHJKL'.split('').map((key) =>
      <Key key={key} label={key} value={key} onClick={clickedLetter} guessState={getLetterGuessState(key)} />

    )}
  </Row>
  <Row className='justify-content-center d-flex flex-nowrap mx-1'>
    <Key key={'submitAttempt'} canPress={readyToSubmit} label={<CheckCircle/>} value={''} onClick={clickedEnter} className={readyToSubmit ? 'bg-success text-dark' : ''} />
    {'ZXCVBNM'.split('').map((key) =>
      <Key key={key} label={key} value={key} onClick={clickedLetter} guessState={getLetterGuessState(key)} />
    )}
    <Key key={'backspace'} value={''} canPress={canBackspace} label={<Backspace/>} onClick={clickedBackspace} />
  </Row>
</>
}