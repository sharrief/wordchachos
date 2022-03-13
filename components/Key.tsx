
import { KeyState } from '@types';
import React from 'react';
import {motion} from 'framer-motion';

function KeyComponent(props: {
  label: JSX.Element | string;
  value: string;
  canPress?: boolean;
  onClick: (letter: string) => void,
  guessState?: KeyState,
  className?: string;
}) {
  const { label, value, onClick, canPress, guessState, className } = props;
  const handleKeyPress = () => {
    onClick(value);
  }
  let guessClass = 'bg-primary';
  if (!value && !canPress) guessClass = 'bg-dark text-dark'
  if (guessState === KeyState.Wrong) guessClass = 'bg-dark text-danger';
  if (guessState === KeyState.Match) guessClass = 'bg-warning text-dark';
  if (guessState === KeyState.Position) guessClass = 'bg-success text-dark';
  return (
      <motion.div
        whileTap={(value || canPress) ? { scale: 0.9 } : {}}
        className={`${className ?? ''} ${guessState === null ? 'col-2' : 'col-1'} rounded d-flex justify-content-center align-items-center ${guessClass}`}
        style={{ height: '4em', margin: '0px 2px 3px 2px' }}
        onClick={() => handleKeyPress()}
      >
        {label}
      </motion.div>
  )
}

export const Key = React.memo(KeyComponent);