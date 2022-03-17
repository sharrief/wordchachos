import { Col, Container, Row } from 'react-bootstrap';
import { Labels } from 'messages/labels';
import { Game, GameState } from 'types';
import { useEffect, useState } from 'react';
import { getSavedGames } from 'game/getSavedGames';
import { getGuessesUsed } from 'game/board';
import { Star } from '@material-ui/icons';
import { GameStreak } from './GuessStreak';

export function GameStats(props: {
  show: boolean;
  game: Game;
}) {
  const { show, game } = props;
  const { type } = game;

  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  useEffect(() => {
    if (show) {
      const history = getSavedGames();
      if (history?.length) { setGameHistory(history); }
    }
  }, [show]);
  const {
    played, wins, currentStreak, maxStreak, guessesSaved,
  } = gameHistory
    .filter((g) => g.type === type && g.state !== GameState.active)
    .reduce((stats, g) => {
      let p = stats.played;
      let w = stats.wins;
      let c = stats.currentStreak;
      let x = stats.maxStreak;
      let a = stats.guessesSaved;
      const { state: s } = g;
      a += g.guessesAllowed - getGuessesUsed(g.board);
      p += 1;
      if (s === GameState.win) {
        c += 1;
        w += 1;
        if (c > x) {
          x = c;
        }
      } else {
        c = 0;
      }
      return {
        wins: w, played: p, currentStreak: c, maxStreak: x, guessesSaved: a,
      };
    }, {
      played: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessesSaved: 0,
    });
  const winPct = Math.floor((wins / (played || 1)) * 100);

  return (
    <Container>
      <Row><Col className='d-flex flex-column align-items-center'>
        <h5>{Labels.StatisticsSubtitle}</h5>
      </Col></Row>
      <Row>
        <Col className='d-flex flex-column align-items-center'>
          <Row><span className='fs-3'>{played}</span></Row>
          <div className='text-center'>{Labels.GamesPlayed}</div>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <div className='d-flex align-items-center justify-content-center'>
            <div style={{ transform: 'scale(1.3)' }}><Star /></div>
            <div className='fs-3'>x{guessesSaved}</div>
          </div>
          <div className='text-center'>{Labels.GuessesSaved}</div>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <Row>
            <span className='fs-3'><GameStreak streak={currentStreak} /></span>
          </Row>
          <div className='text-center'>{Labels.CurrentStreak}</div>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <Row><span className='fs-3'><GameStreak streak={maxStreak} /></span></Row>
          <div className='text-center'>{Labels.MaxStreak}</div>
        </Col>
      </Row>
    </Container>
  );
}
