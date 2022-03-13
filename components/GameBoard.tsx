import { GameBoardSquare } from "@components";
import { Game } from "@types"

export function GameBoard(props: {
  game: Game;
}) {
  const { game } = props;
  const { board, guessIndex, squareIndex } = game;
  return <>{board.map((guess, gI) =>
    <div key={gI} className='col-12 d-flex flex-row justify-content-center w-100'>
      {guess.squares.map((square, sI) =>
        <GameBoardSquare
          key={sI}
          square={square}
          active={gI === guessIndex && sI === squareIndex}
        />)}
    </div>
  )}</>
}