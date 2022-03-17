import { KeyState } from 'types';
import React from 'react';
import { motion } from 'framer-motion';

function KeyComponent(props: {
  label: JSX.Element | string;
  value: string;
  action?: 'enter' | 'delete';
  actionEnabled?: boolean;
  guessState?: KeyState,
  className?: string;
  active?: boolean;
  onClick: (value: string) => void;
}) {
  const {
    label, value, active, action, actionEnabled, guessState, className, onClick,
  } = props;
  let guessClass = 'bg-primary text-light';
  if (action) guessClass = 'bg-dark text-primary';
  if (action === 'delete' && actionEnabled) guessClass = 'bg-primary text-light';
  if (action === 'enter' && actionEnabled) guessClass = 'bg-success text-dark';
  if (action === 'enter' && value === 'new') guessClass = 'bg-secondary text-white';
  if (guessState === KeyState.Wrong) guessClass = 'bg-dark text-danger';
  if (guessState === KeyState.Match) guessClass = 'bg-warning text-dark';
  if (guessState === KeyState.Position) guessClass = 'bg-success text-dark';
  let borderClass = 'border border-2 border-primary';
  if (active) borderClass = 'border border-2 border-info';
  if (actionEnabled && action === 'enter') borderClass = 'border border-2 border-success';
  if (value === 'new' && action === 'enter') borderClass = 'border border-2 border-info';
  return (
      <motion.button
        name={value}
        whileTap={(value || actionEnabled) ? { scale: 0.5 } : {}}
        style={{
          height: '58px', flexGrow: action ? 1.5 : 1, flexShrink: 1, flexBasis: '0%',
        }}
        className={`${className ?? ''} ${guessClass} ${borderClass} p-0 mx-1 d-flex align-items-center justify-content-center rounded col-auto`}
        onTapStart={() => onClick(value)}
      >
      {label}
      </motion.button>
  );
}

export const Key = React.memo(KeyComponent);
