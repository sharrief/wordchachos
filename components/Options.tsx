import { Labels } from 'messages/labels';
import {
  Container, Row, Col, ButtonGroup, Button,
} from 'react-bootstrap';
import { GameType } from 'types';
import Link from 'next/link';

export function Options(props: {
  gameType: GameType;
  setGameType: () => void;
}) {
  const { gameType, setGameType } = props;
  return <Container>
    <Row>
      <Col>
        <div>{Labels.ChooseGameType}</div>
        <ButtonGroup className='my-2'>
          <Link href='/wordle' passHref={true}>
            <Button
              variant={gameType === GameType.wordle ? 'secondary' : 'outline-secondary'}
              onClick={() => setGameType()}
            >
              {Labels.GameTypeWordle}
            </Button>
          </Link>
          <Link href='/random' passHref={true}>
            <Button
              variant={gameType === GameType.random ? 'secondary' : 'outline-secondary'}
              onClick={() => setGameType()}
            >
              <span>{Labels.GameTypeRandom}</span>
            </Button>
          </Link>
        </ButtonGroup>
      </Col>
    </Row>
    <Row>
      <Button variant='link' href='/privacy' rel='noreferrer' target='_blank'>{Labels.PrivacyPolicy}</Button>
    </Row>
  </Container>;
}
