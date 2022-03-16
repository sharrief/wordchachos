import { Col, Container, Row } from 'react-bootstrap';
import { Labels } from 'messages/labels';
import { Game, GameState } from 'types';
import { useEffect, useState } from 'react';
import { getSavedGames } from 'game/getSavedGames';

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
    played, wins, currentStreak, maxStreak,
  } = gameHistory
    .filter((g) => g.type === type && g.state !== GameState.active)
    .reduce((stats, g) => {
      let p = stats.played;
      let w = stats.wins;
      let c = stats.currentStreak;
      let x = stats.maxStreak;
      const { state: s } = g;
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
        wins: w, played: p, currentStreak: c, maxStreak: x,
      };
    }, {
      played: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
    });
  const winPct = Math.floor((wins / (played || 1)) * 100);

  return (
    <Container>
      <Row><Col className='d-flex flex-column align-items-center'>
        <h5>{Labels.StatisticsSubtitle}</h5>
      </Col></Row>
      <Row>
        <Col className='d-flex flex-column align-items-center'>
          <Row><h3>{played}</h3></Row>
          <Row>{Labels.GamesPlayed}</Row>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <Row><h3>{winPct}</h3></Row>
          <Row>{Labels.WinPct}</Row>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <Row><h3>{currentStreak}</h3></Row>
          <Row>{Labels.CurrentStreak}</Row>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <Row><h3>{maxStreak}</h3></Row>
          <Row>{Labels.MaxStreak}</Row>
        </Col>
      </Row>
    </Container>
  );
}
