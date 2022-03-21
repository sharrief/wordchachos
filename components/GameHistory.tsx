import {
  Col, Container, Pagination, Row,
} from 'react-bootstrap';
import {
  GameState, GameType, KeyState, Square,
} from 'types';
import { useState } from 'react';
import { getGuessesUsed } from 'game/board';
import { DateTime } from 'luxon';
import { getScore } from 'game/getScore';
import usePagination from '@mui/material/usePagination';
import { shortNumber } from 'utils/shortNumber';
import { Cloud } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { GameStars } from './GuessStars';
import { GameStreak } from './GuessStreak';
import { useGames } from './data/useGames';
import { useUser } from './data/useUser';

export function GameHistory() {
  const router = useRouter();
  const { gameType: gameRoute } = router.query;
  const type = gameRoute === 'random' ? GameType.random : GameType.wordle;
  const { data: user } = useUser();
  const { data: gameHistory } = useGames(user);

  let streak = 0;
  const games = (gameHistory || [])
    .filter((g) => g.type === type && g.state !== GameState.active)
    .map((g) => {
      const guessesUsed = getGuessesUsed(g.board);
      const gameDate = DateTime.fromMillis(g.timestamp).toFormat('MM/dd/yy');
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
      const answerSquares = g.answer?.split('').map((l) => lettersMatched[l] || { state: KeyState.Unused, letter: l });
      if (g.state === GameState.win) {
        streak += 1;
      } else {
        streak = 0;
      }
      return {
        ...g, guessesUsed, gameDate, answerSquares, streak,
      };
    });
  const perPage = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(Math.max((games.length) / (perPage || 1), 1));
  const handlePageClicked = (pageNumber: number) => setPage(Math.max(0, Math.min(pageNumber, totalPages)));
  const getPageByIndex = (index: number) => Math.ceil((index + 1) / (perPage || 1));
  const { items } = usePagination({
    count: totalPages,
    onChange: (e, p) => handlePageClicked(p),
    page,
    showFirstButton: true,
    showLastButton: true,
    boundaryCount: 1,
    siblingCount: 1,
  });

  return (
    <>
      <Container>
        {games
          .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
          .filter((_o, i) => getPageByIndex(i) === page)
          .map(({
            _id, id, gameDate, guessesUsed, guessesAllowed, answerSquares, streak: s,
          }) => (
            <Row key={id} className='justify-content-center border-bottom border-1'>
              <Col className='d-flex justify-content-center align-items-center col-5'>
                <div className='col-4'>{_id && <Cloud/>}</div>
                <div className='col-6'>{gameDate}</div>
              </Col>
              <Col className='d-flex justify-content-center align-items-center col-3'>
                <div className='col-6'>
                  <GameStars guessesAllowed={guessesAllowed} guessesUsed={guessesUsed} size='sm' />
                </div>
                <div className='col-6 text-center'>+{shortNumber(getScore(guessesUsed))}</div>
              </Col>
              <Col className='d-flex justify-content-center align-items-center col-4'>
                <div className='col-6 d-flex justify-content-end'><GameStreak streak={s} />  </div>
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
        <div className='d-flex justify-content-center mt-2'>
          <Pagination>
            {items.map((item, i) => {
              if (item.type === 'page') {
                return <Pagination.Item
                  key={i}
                  active={item.selected}
                  onClick={item.onClick}>
                  {item.page}
                </Pagination.Item>;
              }
              if (item.type === 'first') {
                return <Pagination.First
                  key={i}
                  onClick={item.onClick}
                />;
              }
              if (item.type === 'last') {
                return <Pagination.Last
                  key={i}
                  onClick={item.onClick}
                />;
              }
              if (item.type === 'previous') {
                return <Pagination.Prev
                  key={i}
                  onClick={item.onClick}
                />;
              }
              if (item.type === 'next') {
                return <Pagination.Next
                  key={i}
                  onClick={item.onClick}
                />;
              }
              return null;
            })}
          </Pagination>

        </div>
      </Container>
    </>
  );
}
