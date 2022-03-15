import { Navbar, Container, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { Labels } from "@messages";
import { BarChart, ChatRounded, Settings } from "@material-ui/icons";
import { GameStats, Options } from "@components";
import { Game, GameType } from "@types";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// TODO ugh, don't want to add redux, so ill just pass this handler down
export function Menu(props: { game: Game, setGameType: (gameType: GameType) => void }) {
  const { game, setGameType } = props;
  const [showingStats, setShowingStats] = useState(false);
  const showStats = () => setShowingStats(true);
  const closeStats = () => setShowingStats(false);

  const [showingOptions, setShowingOptions] = useState(false);
  const showOptions = () => setShowingOptions(true);
  const closeOptions = () => setShowingOptions(false);

  return <><Navbar expand="lg" variant="dark" bg="dark">
    <Container fluid>
      <Row className='w-100 g-0 justify-content-between'>
        <Col xs='2'>
          <Button variant='link' size='sm' className='d-flex' onClick={showOptions}><Settings /> {game.type === GameType.wordle ? Labels.GameTypeWordle.toLowerCase() : Labels.GameTypeRandom.toLowerCase()}</Button>
          
          </Col>
        <Col xs='auto' className="text-center">
          <Navbar.Brand className="m-0">{Labels.SiteTitle.toUpperCase()}</Navbar.Brand>
        </Col>
        <Col xs='2' className='d-flex flex-row justify-content-end'>
          <Button variant='link' size='sm' onClick={showStats}><BarChart /></Button>
        </Col>
      </Row>
    </Container>
  </Navbar>
    <Modal show={showingStats} onHide={closeStats} centered>
      <Modal.Header closeButton>{Labels.Statistics.toUpperCase()}: {game.type === GameType.wordle ? Labels.GameTypeWordle : Labels.GameTypeRandom}</Modal.Header>
      <Modal.Body>
        <GameStats show={showingStats} game={game} />
      </Modal.Body>
    </Modal>
    <Modal show={showingOptions} onHide={closeOptions} centered>
      <Modal.Header closeButton>{Labels.Options.toUpperCase()}</Modal.Header>
      <Modal.Body>
        <Options gameType={game.type} setGameType={setGameType} />
      </Modal.Body>
    </Modal>
  </>
}