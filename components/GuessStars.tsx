import { Star, StarBorder, Remove } from '@material-ui/icons';
import { Col } from 'react-bootstrap';
import { GameState } from 'types';

export function GameStars(props: {
  guessesAllowed: number;
  guessesUsed: number;
  state: GameState;
}) {
  const { guessesAllowed, guessesUsed, state } = props;
  return <Col className='d-flex justify-content-center align-items-center'>
    {state === GameState.win
      ? <><div className='d-none d-sm-flex'>
        {[...Array(guessesAllowed - 1)].map((_i, i) => {
          if (i < (guessesAllowed - guessesUsed)) return <Star key={i} />;
          return <StarBorder key={i} />;
        })}
      </div>
        <div className='d-flex d-sm-none'>
          {state === GameState.win ? <><Star />x{guessesAllowed - guessesUsed}</> : <Remove />}
        </div>
      </>
      : <Remove />
    }
  </Col>;
}
