import { AnimatePresence, motion } from 'framer-motion';
import { Board, GameType, KeyState } from 'types';

export function GameBoardSquare(props: {
  board: Board;
  guessIndex: number;
  squareIndex: number;
  thisGuess: number;
  thisSquare: number;
  gameType: GameType;
}) {
  const {
    board, guessIndex, squareIndex, thisGuess, thisSquare, gameType,
  } = props;
  const square = board[thisGuess].squares[thisSquare];
  const { state, letter } = square;
  const active = guessIndex === thisGuess && squareIndex === thisSquare;
  const activeClass = active ? ' border-info ' : '';
  const positionClass = state === KeyState.Position ? ' bg-success text-dark' : '';
  const matchClass = state === KeyState.Match ? ' bg-warning text-dark' : '';
  const wrongClass = state === KeyState.Wrong ? ' bg-dark text-danger' : '';
  const classes = `${activeClass}${positionClass}${matchClass}${wrongClass}`;
  const letterShownAnimation = {
    scale: [0.1, 1],
    rotate: [0, 360],
  };
  return (<div
    className={`${classes} border border-1 m-1 d-flex justify-content-center align-items-center fs-2 `}
    style={{ height: '2em', width: '2em' }}
  >
    <AnimatePresence>
      {letter
        && <motion.div
          key={`${thisGuess}-${thisSquare}-${gameType}`}
          style={{ scale: 0 }}
          animate={letter ? letterShownAnimation : undefined}
          // exit={letterHideAnimation}
          transition={{ duration: 0.2 }}
        >
          {letter}
        </motion.div>
      }
    </AnimatePresence>
  </div>);
}
