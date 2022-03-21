import { GameBoardSquare } from 'components/GameBoardSquare';
import { getGuessString } from 'game/guess';
import { Game, Guess } from 'types';

export function GameBoard(props: {
  game: Game;
}) {
  const { game } = props;
  const { board, guessIndex, squareIndex } = game;
  const openDefinition = (guess: Guess) => {
    /** If guess has been checked */
    if (guess.checked) {
      const guessString = getGuessString(guess);
      if (guessString) { window.open(`https://www.merriam-webster.com/dictionary/${guessString}`); }
    }
  };
  return <>{board.map((guess, gI) => <div
  key={gI}
  className='col-12 d-flex flex-row justify-content-center w-100'
  style={guess.checked ? { cursor: 'pointer' } : {}}
  onClick={() => openDefinition(guess)}>
      {guess.squares.map((square, sI) => <GameBoardSquare
          key={sI}
          board={board}
          guessIndex={guessIndex}
          thisGuess={gI}
          thisSquare={sI}
          squareIndex={squareIndex}
          gameType={game.type}
        />)}
    </div>)}</>;
}
