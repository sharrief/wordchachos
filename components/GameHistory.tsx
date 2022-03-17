import { Col, Container, Row } from 'react-bootstrap';
import { Labels } from 'messages/labels';
import {
  Game, GameState, KeyState, Square,
} from 'types';
import { useEffect, useState } from 'react';
import { getSavedGames } from 'game/getSavedGames';
import { getGuessesUsed } from 'game/board';
import { DateTime } from 'luxon';
import {
  Remove, Star, StarBorder, Whatshot,
} from '@material-ui/icons';
import { GameStars } from './GuessStars';
import { GameStreak } from './GuessStreak';

export function GameHistory(props: {
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
  let streak = 0;
  const games = gameHistory
    .filter((g) => g.type === type && g.state !== GameState.active)
    .map((g) => {
      const guessesUsed = getGuessesUsed(g.board);
      const gameDate = DateTime.fromMillis(g.timestamp).toLocaleString(DateTime.DATE_SHORT);
      const lettersMatched = g.board.reduce((acc, guess) => {
        const letters = { ...acc } as { [key: string]: Square };
        guess.squares.forEach((square) => {
          const { letter, state } = square;
          if (letters[letter]) {
            const { state: s } = letters[letter];
            if (s === KeyState.Position) {
              return;
            }
            if (state === KeyState.Position) {
              letters[letter] = square;
            }
            if (s !== KeyState.Match && state === KeyState.Match) {
              letters[letter] = square;
            }
          }
          letters[letter] = square;
        });
        return letters;
      }, {} as { [key: string]: Square });
      const answerSquares = g.answer.split('').map((l) => lettersMatched[l] || { state: KeyState.Unused, letter: l });
      if (g.state === GameState.win) {
        streak += 1;
      } else {
        streak = 0;
      }
      return {
        ...g, guessesUsed, gameDate, answerSquares, streak,
      };
    });

  return (
    <>
      <Container>
        <Row><Col className='d-flex flex-column align-items-center'>
          <h5>{Labels.GameHistory}</h5>
        </Col></Row>
        {games.map(({
          id, gameDate, guessesUsed, guessesAllowed, answerSquares, state, streak: s,
        }) => (
          <Row key={id} className='justify-content-center'>
            <Col className='text-center'>{gameDate}</Col>
            <Col className='justify-content-center align-items-center'>
              <GameStars guessesAllowed={guessesAllowed} guessesUsed={guessesUsed} state={state} />
            </Col>
            <Col className='d-flex justify-content-center align-items-center'>
              <div className='col-6'><GameStreak streak={s}/>  </div>
              <div className='col-6'>{answerSquares.map((a, i) => (
                <span key={i} className={
                  // eslint-disable-next-line no-nested-ternary
                  a.state === KeyState.Position ? 'text-success'
                    : a.state === KeyState.Match ? 'text-warning'
                      : 'text-dark'}>{a.letter}</span>
              ))}
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </>
  );
}
