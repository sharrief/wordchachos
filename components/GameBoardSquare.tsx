import { AnimatePresence, motion } from 'framer-motion';
import { KeyState, Square } from 'types';

export function GameBoardSquare(props: {
  square: Square
  active: boolean;
}) {
  const { active, square } = props;
  const { state, letter } = square;
  const activeClass = active ? ' border-info ' : '';
  const positionClass = state === KeyState.Position ? ' bg-success text-dark' : '';
  const matchClass = state === KeyState.Match ? ' bg-warning text-dark' : '';
  const wrongClass = state === KeyState.Wrong ? ' bg-dark text-danger' : '';
  const classes = `${activeClass}${positionClass}${matchClass}${wrongClass}`;
  const letterShownAnimation = {
    scale: [0.1, 1],
    rotate: [0, 360],
  };
  const letterHideAnimation = {
    scale: [1, 0],
    rotate: [360, 0],
  };
  return (<div
    className={`${classes} border border-1 m-1 d-flex justify-content-center align-items-center fs-2 `}
    style={{ height: '2em', width: '2em' }}
  >
    <AnimatePresence>
    <motion.div
      key={letter}
      style={{ scale: 0 }}
      animate={letter ? letterShownAnimation : undefined}
      exit={letterHideAnimation}
    >{letter}</motion.div></AnimatePresence>
  </div>);
}
