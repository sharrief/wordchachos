import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { Labels } from "@messages";
import { Game, GameState, GameType, KeyState } from "@types";
import { Share } from "@material-ui/icons";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from "react";
import * as emoji from 'github-emoji';

export function EndScreen(props: {
  show: boolean;
  game: Game;
  onHide: () => void;
  handleNewRandomGame: () => void;
}) {
  const { show, game, onHide, handleNewRandomGame } = props;
  const { board, state, guessIndex: guesses, answer, type, seed, guessesAllowed } = game;
  const win = state === GameState.win;
  const loss = state === GameState.loss;
  const position = '&#129001;';
  const match = '&#129000;';
  const wrong = '&#11035;';
  const gameResult = `${type === GameType.wordle ? Labels.GameTypeWordle : Labels.GameTypeRandom} ${seed ?? ''} ${guesses}/${guessesAllowed}

${board
    .filter((_,idx) => idx < guesses)
    .map(({ squares }) => {
    return squares.map(({ state }) => {
      switch (state) {
        case KeyState.Position:
          return emoji.stringOf('green_square');
        case KeyState.Match:
          return emoji.stringOf('yellow_square');
        case KeyState.Wrong:
        default:
          return emoji.stringOf('black_large_square');
      }
    }).join('');
  }).join(`
`)}`;
  const [copied, setCopied] = useState(false);
  
  return (<Modal show={show} centered onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        {win && Labels.WinTitle(guesses)}
        {loss && Labels.LossTitle}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>
        {win && Labels.WinSubtitle(guesses)}
        {loss && Labels.LossSubtitle}
      </h4>
      <h5>The answer was {answer}</h5>
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
            {Labels.StartANewGameButton}
          </Button>}
      </ButtonGroup>
    </Modal.Body>
  </Modal>)
}