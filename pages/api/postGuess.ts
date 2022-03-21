import { queryCurrentGame } from 'database/queryCurrentGame';
import { updateGame } from 'database/updateGame';
import { submitGuess } from 'game/submitGuess';
import { setGuessFromString } from 'game/setGuessFromString';
import { Errors } from 'messages/errors';
import { api } from 'pages/api/_api';
import { GameState, Req, Res } from 'types';
import { getUserFromCookie, trimAnswer } from './_util';

export default async function handler<T extends typeof api.postGuess>(req: Req<T>, res: Res<T>) {
  try {
    const { guessString, gameType } = req.body;
    const { name, code } = getUserFromCookie(req);
    const { game, error } = await queryCurrentGame(name, code, gameType);
    if (error) throw new Error(error);
    if (!game) throw new Error(Errors.CantFindGame);
    const gameWithGuess = setGuessFromString(guessString, game);
    const updatedGame = submitGuess(gameWithGuess);
    const { error: updateError } = await updateGame(updatedGame);
    if (updateError) throw new Error(updateError);
    if (updatedGame.state === GameState.active) {
      const trimmedGame = trimAnswer(updatedGame);
      res.send({ data: trimmedGame });
      return;
    }
    res.send({ data: updatedGame });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}
