import { Col, Container, Row } from 'react-bootstrap';
import { Labels } from 'messages/labels';
import { Game, GameState } from 'types';
import { useEffect, useState } from 'react';
import { getSavedGames } from 'game/getSavedGames';
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

export function GameStats(props: {
  show: boolean;
  game: Game;
}) {
  const { show, game } = props;
  const {
    guessIndex: guesses, type, guessesAllowed, state,
  } = game;
  const gameComplete = state !== GameState.active;

  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  useEffect(() => {
    if (show) {
      const history = getSavedGames();
      if (history?.length) { setGameHistory(history); }
    }
  }, [show]);
  let guessLength = 6;
  let played = 0;
  let currentStreak = 0;
  let maxStreak = 0;
  let wins = 0;
  const guessesUsedByGame = gameHistory
    .filter((g) => g.type === type)
    .map((g) => {
      const { board, answer, state: s } = g;
      const answerLength = answer.length;
      played += 1;
      if (s === GameState.win) {
        currentStreak += 1;
        wins += 1;
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
  const winPct = Math.floor((wins / (played || 1)) * 100);
  const sumByGuessesUsed = guessesUsedByGame.reduce((acc, guessesUsed) => ({ ...acc, [guessesUsed]: (acc[guessesUsed] ?? 0) + 1 }), {} as { [guessesUsed: number]: number });
  const guessesUsedDataArray = [...Array(guessLength)].map((_, idx) => sumByGuessesUsed[idx + 1] ?? 0);
  // TODO investigate type options with datalabels
  // eslint-disable-next-line
  const dataSet: any = {
    labels: [1, 2, 3, 4, 5, 6],
    datasets: [
      {
        label: Labels.GuessesUsed,
        data: guessesUsedDataArray,
        borderColor: (context: Context) => {
          const guessNumber = context.dataIndex + 1;
          return (gameComplete && guessNumber === guesses) ? '#3cf281' : '#444';
        },
        backgroundColor: (context: Context) => {
          const guessNumber = context.dataIndex + 1;
          return (gameComplete && guessNumber === guesses) ? '#3cf281' : '#444';
        },
        datalabels: {
          display(context: Context) {
            return context.dataset.data[context.dataIndex]; // display labels with an odd index
          },
          color: '#fff',
          anchor: 'end',
          align: 'start',
          font: {
            weight: '800',
          },
        },
      },
    ],
  };
  // TODO investigate type issues with ChartOptions and scales prop
  // const options: ChartOptions = {
  // eslint-disable-next-line
  const options: any = {
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
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <Container>
        <Row><Col className='d-flex flex-column align-items-center'>
          <h5>{Labels.StatisticsSubtitle}</h5>
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
      <hr className="border border-1" />
      <div className="text-center mt-4"><h5 className='text-success'>{Labels.GuessDistribution.toUpperCase()}</h5></div>
      <Bar options={options} data={dataSet} />
    </>
  );
}
