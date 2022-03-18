import { Remove } from '@material-ui/icons';
import Image from 'next/image';
import { Col } from 'react-bootstrap';

export function GameStars(props: {
  guessesAllowed: number;
  guessesUsed: number;
  size: 'lg'|'sm',
}) {
  const { guessesAllowed, guessesUsed, size } = props;
  const medalMap: {[key: number]: string } = {
    1: 'diamond',
    2: 'platinum',
    3: 'gold',
    4: 'silver',
    5: 'bronze',
  };
  const star = medalMap[guessesUsed];
  return <Col className='d-flex justify-content-center align-items-center'>
    {guessesUsed < guessesAllowed
      ? <><div>
          {(guessesUsed < guessesAllowed && star)
          && <Image
          src={`/images/${star}.svg`}
          alt={`${star} award`}
          height={size === 'lg' ? '100' : '30'}
          width={size === 'lg' ? '100' : '30'} />}
      </div>
      </>
      : <Remove />
    }
  </Col>;
}
