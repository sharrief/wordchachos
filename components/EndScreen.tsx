import {
  Button, ButtonGroup, Container, Modal,
} from 'react-bootstrap';
import { Labels } from 'messages/labels';
import {
  Game, GameState, GameType, KeyState,
} from 'types';
import { Add, Share } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from 'react';
import * as emoji from 'github-emoji';
import { saveGame } from 'game/saveGame';
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
  useEffect(() => {
    if (game?.state !== GameState.active) {
      saveGame(game);
    }
  }, [game]);
  const {
    board, state, guessIndex: guesses, answer, type, seed, guessesAllowed,
  } = game;
  const guessesUsed = getGuessesUsed(board);
  const win = state === GameState.win;
  const loss = state === GameState.loss;
  const gameResult = `${Labels.GameTypeTitle(type)} ${seed ?? ''} ${guesses}/${guessesAllowed}
  
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
  const [copied, setCopied] = useState(false);
  const handleOnHide = () => {
    setCopied(false);
    onHide();
  };

  return (<Modal show={show} centered onHide={handleOnHide}>
    <Modal.Header closeButton>
      <Modal.Title>
      {win && `${Labels.WinTitle(guesses).toLocaleUpperCase()}`}
      {loss && `${Labels.LossTitle}`}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container className="text-center">
        <div className='fs-4'>
          {win && `${Labels.WinSubtitle(guesses)}`}
          {loss && `${Labels.LossSubtitle}`}
        </div>
        {answer && <div className='fs-5'>{Labels.TheAnswerWas} {(win || loss)
          ? <a
        href={`https://www.merriam-webster.com/dictionary/${answer}`}
        className='text-warning'
        rel="noreferrer"
        target='_blank'>{answer}</a> : ''}</div>}
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
          {type === GameType.Random
            && <Button
              variant='secondary'
              onClick={handleNewRandomGame}
            >
              {Labels.StartANewGameButton} <Add />
            </Button>}
        </ButtonGroup>
      </Container>
      <hr className="border border-1" />
      <Stats />
    </Modal.Body>
  </Modal>);
}
