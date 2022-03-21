import {
  Button, ButtonGroup, Container, Modal,
} from 'react-bootstrap';
import { Labels } from 'messages/labels';
import { Errors } from 'messages/errors';
import {
  Game, GameState, GameType, KeyState,
} from 'types';
import { Add, Share } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import * as emoji from 'github-emoji';
import { getGuessesUsed } from 'game/board';
import { getScore } from 'game/getScore';
import { Stats } from './Stats';
import { GameStars } from './GuessStars';

export function EndScreen(props: {
  show: boolean;
  game: Game;
  onHide: () => void;
  handleNewRandomGame: () => void;
}) {
  const {
    show, game, onHide, handleNewRandomGame,
  } = props;
  const [copied, setCopied] = useState(false);
  const handleOnHide = () => {
    setCopied(false);
    onHide();
  };
  const {
    board, state, guessIndex: guesses, answer, type, seed, guessesAllowed,
  } = game;
  if (!game.board) {
    onHide();
    return null;
  }
  const guessesUsed = getGuessesUsed(board);
  const win = state === GameState.win;
  const loss = state === GameState.loss;
  const gameResult = `${type === GameType.wordle ? Labels.GameTypeWordle : Labels.GameTypeRandom} ${seed ?? ''} ${guesses}/${guessesAllowed}
  
${board.filter((_, idx) => idx < guesses)
    .map(({ squares }) => squares.map(({ state: s }) => {
      switch (s) {
        case KeyState.Position:
          return emoji.stringOf('green_square');
        case KeyState.Match:
          return emoji.stringOf('yellow_square');
        case KeyState.Wrong:
        default:
          return emoji.stringOf('black_large_square');
      }
    }).join('')).join(`
`)}`;

  return (<Modal show={show} centered onHide={handleOnHide}>
    <Modal.Header closeButton>
      <Modal.Title>
      {win && `${Labels.WinTitle(guesses).toLocaleUpperCase()}`}
      {loss && `${Labels.LossTitle}`}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container className="text-center mb-3">
        <div className='fs-4'>
          {win && `${Labels.WinSubtitle(guesses)}`}
          {loss && `${Labels.LossSubtitle}`}
        </div>
        <div className='fs-5'>{Labels.TheAnswerWas} {(win || loss) ? <span className='text-warning'>{answer || Errors.MissingAnswer}</span> : ''}</div>
        <GameStars guessesAllowed={guessesAllowed} guessesUsed={guessesUsed} size='lg' />
        <div className='fs-3'>+{getScore(guessesUsed)}</div>
        <p>{Labels.ShareGameMessage}</p>
        <ButtonGroup>
          <CopyToClipboard
            onCopy={() => setCopied(true)}
            text={gameResult.toString()}
          ><Button
            variant='info'
          >{copied ? Labels.Copied : Labels.ShareGame} <Share />
            </Button>
          </CopyToClipboard>
          {type === GameType.random
            && <Button
              variant='secondary'
              onClick={handleNewRandomGame}
            >
              {Labels.StartANewGameButton} <Add />
            </Button>}
        </ButtonGroup>
      </Container>
      <Stats/>
    </Modal.Body>
  </Modal>);
}
