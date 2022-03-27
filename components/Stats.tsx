import { Game } from 'types';
import { GameHistory } from './GameHistory';
import { GameStats } from './GameStats';
import { GuessChart } from './GuessChart';

export function Stats(props: {
  show: boolean;
  game: Game;
}) {
  const { game, show } = props;
  if (!game) return null;
  return <>
    <GameStats game={game} show={show} />
    <hr className="border border-1" />
    <GuessChart show={show} game={game} />
    <hr className="border border-1" />
    <GameHistory show={show} game={game} />
  </>;
}
