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
import { getGuessesUsed } from 'game/board';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export function GuessChart(props: {
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
  const guessesUsedByGame = gameHistory
    .filter((g) => g.type === type && g.state === GameState.win)
    .map((g) => {
      const { board } = g;
      const guessesUsed = getGuessesUsed(board);
      return guessesUsed;
    });
  const sumByGuessesUsed = guessesUsedByGame.reduce((acc, guessesUsed) => ({ ...acc, [guessesUsed]: (acc[guessesUsed] ?? 0) + 1 }), {} as { [guessesUsed: number]: number });
  const guessesUsedDataArray = [...Array(guessesAllowed)].map((_, idx) => sumByGuessesUsed[idx + 1] ?? 0);
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

  return <>
    <div className="text-center mt-4"><h5 className='text-success'>{Labels.GuessDistribution.toUpperCase()}</h5></div>
    <Bar options={options} data={dataSet} />
  </>;
}
