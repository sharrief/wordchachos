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
          <Link href={'/wordOfTheDay'} passHref={true}>
            <Button
              variant={gameType === GameType.WotD ? 'secondary' : 'outline-secondary'}
              onClick={() => setGameType()}
            >
              {Labels.GameTypeTitle(GameType.WotD)}
            </Button>
          </Link>
          <Link href={'/wordle'} passHref={true}>
            <Button
              variant={gameType === GameType.Wordle ? 'secondary' : 'outline-secondary'}
              onClick={() => setGameType()}
            >
              {Labels.GameTypeTitle(GameType.Wordle)}
            </Button>
          </Link>
          <Link href={'/random'} passHref={true}>
            <Button
              variant={gameType === GameType.Random ? 'secondary' : 'outline-secondary'}
              onClick={() => setGameType()}
            >
              <span>{Labels.GameTypeTitle(GameType.Random)}</span>
            </Button>
          </Link>
        </ButtonGroup>
      </Col>
    </Row>
    <hr className='border border-1 border-white'/>
    <Row>
      <Col>
        <Button variant='link' href='/privacy' rel='noreferrer' target='_blank'>{Labels.PrivacyPolicy}</Button>
      </Col>
      <Col>
        <Button variant='link' href='http://github.com/sharrief/wordchachos' rel='noreferrer' target='_blank'>{Labels.GitHub}</Button>
      </Col>
    </Row>
  </Container>;
}
