import {
  Navbar, Container, Row, Col, Button, Modal,
} from 'react-bootstrap';
import { Labels } from 'messages/labels';
import { BarChart, Settings } from '@material-ui/icons';
import { Options } from 'components/Options';
import { Game } from 'types';
import { useState } from 'react';
import { Stats } from './Stats';

// TODO ugh, don't want to add redux, so ill just pass this handler down
export function Menu(props: { game: Game, seed?: number; }) {
  const { game } = props;
  const [showingStats, setShowingStats] = useState(false);
  const showStats = () => setShowingStats(true);
  const closeStats = () => setShowingStats(false);

  const [showingOptions, setShowingOptions] = useState(false);
  const showOptions = () => setShowingOptions(true);
  const closeOptions = () => setShowingOptions(false);
  const handleSetGameType = () => {
    closeOptions();
  };

  return <><Navbar expand="lg" variant="dark" bg="dark">
    <Container fluid>
      <Row className='w-100 g-0 justify-content-between'>
        <Col xs='2'>
          <Button
          variant='link'
          size='sm'
          className='text-decoration-none d-flex'
          onClick={showOptions}>
            <Settings /> {Labels.GameTypeTitle(game.type).toLowerCase()}
          </Button>
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
      <Modal.Header closeButton>{Labels.Statistics.toUpperCase()}: {Labels.GameTypeTitle(game.type)}</Modal.Header>
      <Modal.Body>
        <Stats show={showingStats} game={game} />
      </Modal.Body>
    </Modal>
    <Modal show={showingOptions} onHide={closeOptions} centered>
      <Modal.Header closeButton>{Labels.Options.toUpperCase()}</Modal.Header>
      <Modal.Body>
        <Options gameType={game.type} setGameType={handleSetGameType} />
      </Modal.Body>
    </Modal>
  </>;
}
