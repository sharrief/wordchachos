import { Accordion, Button, ButtonGroup, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { Labels } from "@messages";
import { Game, GameState, GameType, KeyState, SavedGameV1 } from "@types";
import { Add, Share } from "@material-ui/icons";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";
import * as emoji from 'github-emoji';
import { saveGame, getSavedGames } from "@game";
import { Bar } from 'react-chartjs-2';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { GameStats } from "@components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);


export function EndScreen(props: {
  show: boolean;
  game: Game;
  onHide: () => void;
  handleNewRandomGame: () => void;
}) {
  const { show, game, onHide, handleNewRandomGame } = props;
  const [gameSaved, setGameSaved] = useState(false);
  useEffect(() => {
    if (game?.state !== GameState.active) {
      saveGame(game);
      setGameSaved(true);
    }
  }, [game])
  const { board, state, guessIndex: guesses, answer, type, seed, guessesAllowed } = game;
  const win = state === GameState.win;
  const loss = state === GameState.loss;
  const gameResult = `${type === GameType.wordle ? Labels.GameTypeWordle : Labels.GameTypeRandom} ${seed ?? ''} ${guesses}/${guessesAllowed}
  
${board.filter((_, idx) => idx < guesses)
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
  const handleOnHide = () => {
    setCopied(false);
    onHide();
  }
  

  return (<Modal show={show} centered onHide={handleOnHide}>
    <Modal.Header closeButton>
      <Modal.Title>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container className="text-center">
        <h4>
          {win && `${Labels.WinTitle(guesses).toLocaleUpperCase()} ${Labels.WinSubtitle(guesses)}`}
          {loss && `${Labels.LossTitle} ${Labels.LossSubtitle}`}
        </h4>
        <h5>{Labels.TheAnswerWas} {(win||loss) ? answer : ''}</h5>
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
      <hr className="border border-1" />
      <GameStats show={show} game={game} />
    </Modal.Body>
  </Modal>)
}