
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
  active?: boolean;
}) {
  const { label, value, active, onClick, canPress, guessState, className } = props;
  const handleKeyPress = () => {
    onClick(value);
  }
  let guessClass = 'bg-primary';
  if (!value && !canPress) guessClass = 'bg-dark text-primary'
  if (guessState === KeyState.Wrong) guessClass = 'bg-dark text-danger';
  if (guessState === KeyState.Match) guessClass = 'bg-warning text-dark';
  if (guessState === KeyState.Position) guessClass = 'bg-success text-dark';
  let activeClass = '';
  if (active) activeClass = 'border border-info border-2';
  return (
      <motion.div
        whileTap={(value || canPress) ? { opacity: 0.5 } : {}}
        className={`${className ?? ''} rounded d-flex justify-content-center align-items-center ${guessClass} ${activeClass}`}
        style={{ height: '3em', margin: '0px 2px 3px 2px', width: guessState == null ? '15%' : '10%' }}
        onClick={() => handleKeyPress()}
      >
        {label}
      </motion.div>
  )
}

export const Key = React.memo(KeyComponent);