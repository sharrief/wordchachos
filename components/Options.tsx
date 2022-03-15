import { Labels } from "@messages";
import { Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import { GameType } from "@types";

export function Options(props: {
  gameType: GameType;
  setGameType: (gameType: GameType) => void;
}) {
  const { gameType, setGameType } = props;
  return <Container>
    <Row>
      <Col>
        <span>{Labels.ChooseGameType}</span>
        <ButtonGroup className='my-2'>
          <Button
            variant={gameType === GameType.wordle ? 'secondary' : 'outline-secondary'}
            onClick={() => setGameType(GameType.wordle)}
          >
            {Labels.GameTypeWordle}
          </Button>
          <Button
            variant={gameType === GameType.random ? 'secondary' : 'outline-secondary'}
            onClick={() => setGameType(GameType.random)}
          >
            {Labels.GameTypeRandom}
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  </Container>
}