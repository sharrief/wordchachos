import { Col, Container, Row } from 'react-bootstrap';
import { Labels } from 'messages/labels';
import { GameState, GameType } from 'types';
import { getGuessesUsed } from 'game/board';
import { getScore } from 'game/getScore';
import { shortNumber } from 'utils/shortNumber';
import { useRouter } from 'next/router';
import { GameStreak } from './GuessStreak';
import { useGames } from './data/useGames';
import { useUser } from './data/useUser';

export function GameStats() {
  const router = useRouter();
  const { gameType: gameRoute } = router.query;
  const type = gameRoute === 'random' ? GameType.random : GameType.wordle;

  const { data: user } = useUser();
  const { data: gameHistory } = useGames(user);

  const {
    played, currentStreak, maxStreak, score,
  } = (gameHistory || [])
    .filter((g) => g.type === type && g.state !== GameState.active)
    .reduce((stats, g) => {
      let p = stats.played;
      let w = stats.wins;
      let c = stats.currentStreak;
      let x = stats.maxStreak;
      let a = stats.score;
      const { state: s } = g;
      p += 1;
      a += getScore(getGuessesUsed(g.board));
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
        wins: w, played: p, currentStreak: c, maxStreak: x, score: a,
      };
    }, {
      played: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
      score: 0,
    });

  return (
    <Container>
      <Row>
        <Col className='d-flex flex-column align-items-center'>
          <Row><span className='fs-3'>{played}</span></Row>
          <div className='text-center'>{Labels.GamesPlayed}</div>
        </Col>
        <Col className='d-flex flex-column align-items-center'>
          <div className='d-flex align-items-center justify-content-center'>
            <div className='fs-3'>{shortNumber(score)}</div>
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
