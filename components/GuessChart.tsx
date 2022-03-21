import { Labels } from 'messages/labels';
import { GameState, GameType } from 'types';
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
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { getUninitializedGame } from 'game/initGame';
import { useCurrentGame } from './data/useCurrentGame';
import { useTodaysSeed } from './data/useTodaysSeed';
import { useUser } from './data/useUser';
import { useGames } from './data/useGames';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export function GuessChart() {
  const router = useRouter();
  const { gameType: gameRoute } = router.query;
  const type = gameRoute === 'random' ? GameType.random : GameType.wordle;
  const { data: user } = useUser();
  const { data: todaysSeed } = useTodaysSeed(DateTime.local());
  const { data: game } = useCurrentGame(user, type, todaysSeed);
  const { data: gameHistory } = useGames(user);
  const { state, guessesAllowed, guessIndex } = game || getUninitializedGame(type);
  const gameComplete = state !== GameState.active;

  const guessesUsedByGame = (gameHistory || [])
    .filter((g) => g.type === type)
    .map((g) => {
      const { board, state: s } = g;
      if (s === GameState.loss) return guessesAllowed + 1;
      const guessesUsed = getGuessesUsed(board);
      return guessesUsed;
    });
  const sumByGuessesUsed = guessesUsedByGame.reduce((acc, guessesUsed) => ({ ...acc, [guessesUsed]: (acc[guessesUsed] ?? 0) + 1 }), {} as { [guessesUsed: number]: number });
  const guessesUsedDataArray = [...Array(guessesAllowed + 1)].map((_, idx) => sumByGuessesUsed[idx + 1] ?? 0);
  // TODO investigate type options with datalabels
  // eslint-disable-next-line
  const dataSet: any = {
    labels: ['1', '2', '3', '4', '5', '6', '-'],
    datasets: [
      {
        label: Labels.GuessesUsed,
        data: guessesUsedDataArray,
        borderColor: (context: Context) => {
          const guessNumber = context.dataIndex + 1;
          return (gameComplete && guessNumber === guessIndex) ? '#3cf281' : '#444';
        },
        backgroundColor: (context: Context) => {
          const guessNumber = context.dataIndex + 1;
          return (gameComplete && guessNumber === guessIndex) ? '#3cf281' : '#444';
        },
        datalabels: {
          display(context: Context) {
            return context.dataset.data[context.dataIndex]; // display labels with an odd index
          },
          color: (context: Context) => {
            const guessNumber = context.dataIndex + 1;
            return (gameComplete && guessNumber === guessIndex) ? '#000' : '#fff';
          },
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
        title: {
          display: true,
          text: Labels.GamesPlayed,
          color: '#fff',
        },
        grid: {
          drawTicks: false,
          color: '#fff',
        },
        ticks: {
          display: false,
          color: '#fff',
        },
      },
      y: {
        min: 0,
        max: guessesAllowed,
        position: 'left',
        grid: {
          lineWidth: 0,
        },
        title: {
          display: true,
          text: Labels.GuessesUsed,
          color: '#fff',
        },
        ticks: {
          color: '#fff',
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
    <Bar options={options} data={dataSet} />
  </>;
}
