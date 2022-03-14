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
  
${board
      .filter((_, idx) => idx < guesses)
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
  const [gameHistory, setGameHistory] = useState<SavedGameV1[]>([]);
  useEffect(() => {
    if (show && gameSaved) {
      const history = getSavedGames();
      if (history?.length)
        setGameHistory(history)
    }
  }, [show, gameSaved])
  let guessLength = 6;
  let played = 0;
  let currentStreak = 0;
  let maxStreak = 0;
  let wins = 0;
  const guessesUsedByGane = gameHistory
    .filter((g) => g.type === type)
    .map((game) => {
      const { board, answer, state } = game;
      const answerLength = answer.length;
      played++;
      if (state === GameState.win) {
        currentStreak++;
        wins++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
      guessLength = answerLength; // just to be sure
      const guessesUsed = board.reduce((total, guess) => {
        const { squares } = guess;
        const lettersInGuess = squares.reduce((count, square) => {
          if (square.letter !== '') return count + 1;
          return count;
        }, 0);
        if (lettersInGuess === answerLength) return total + 1;
        return total;
      }, 0);
      return guessesUsed;
    });
  const winPct = Math.floor(wins / (played || 1) * 100);
  const sumByGuessesUsed = guessesUsedByGane.reduce((acc, guessesUsed) => {
    return { ...acc, [guessesUsed]: (acc[guessesUsed] ?? 0) + 1 }
  }, {} as { [guessesUsed: number]: number });
  const guessesUsedDataArray = [...Array(guessLength)].map((_, idx) => {
    return sumByGuessesUsed[idx + 1] ?? 0;
  });
  const dataSet = {
    labels: [1, 2, 3, 4, 5, 6],
    datasets: [
      {
        label: Labels.GuessesUsed,
        data: guessesUsedDataArray,
        borderColor: (context: Context) => {
          const guessNumber = context.dataIndex + 1;
          return guessNumber === guesses ? '#3cf281' : '#444'
        },
        backgroundColor: (context: Context) => {
          const guessNumber = context.dataIndex + 1;
          return guessNumber === guesses ? '#3cf281' : '#444'
        },
        datalabels: {
          display: function (context: Context) {
            return context.dataset.data[context.dataIndex]; // display labels with an odd index
          },
          color: '#fff',
          anchor: 'end',
          align: 'start',
          font: {
            weight: '800'
          }
        }
      },
    ],
  };
  const options: ChartOptions = {
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    indexAxis: 'y',
    scales: {
      x: {
        display: false,
      },
      y: {
        min: 0,
        max: guessesAllowed,
        position: 'left',
        grid: {
          lineWidth: 0,
        },
        ticks: {
          color: '#3cf281',
        },
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

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
        <h5>{Labels.TheAnswerWas} {answer}</h5>
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
      <hr className="border border-1"/>
      <Container className='mt-4'>
        <Row><Col className='d-flex flex-column align-items-center'>
          <h5>{Labels.Statistics}</h5>
        </Col></Row>
        <Row>
          <Col className='d-flex flex-column align-items-center'>
            <Row><h3>{played}</h3></Row>
            <Row>{Labels.GamesPlayed}</Row>
          </Col>
          <Col className='d-flex flex-column align-items-center'>
            <Row><h3>{winPct}</h3></Row>
            <Row>{Labels.WinPct}</Row>
          </Col>
          <Col className='d-flex flex-column align-items-center'>
            <Row><h3>{currentStreak}</h3></Row>
            <Row>{Labels.CurrentStreak}</Row>
          </Col>
          <Col className='d-flex flex-column align-items-center'>
            <Row><h3>{maxStreak}</h3></Row>
            <Row>{Labels.MaxStreak}</Row>
          </Col>
        </Row>
      </Container>
      <hr className="border border-1"/>

      <div className="text-center mt-4"><h5 className='text-success'>{Labels.GuessDistribution.toUpperCase()}</h5></div>
      <Bar options={options} data={dataSet} />
    </Modal.Body>
  </Modal>)
}