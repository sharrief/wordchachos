import { Errors } from 'messages/errors';
import { Game, GameState } from 'types';
import { manifestUser } from 'database/queryUser';
import getClient from './getClient';

type ProjectedGame = Omit<Game, 'user_id'|'id'>;

export async function getCompletedGames(name: string, code: string) {
  const client = getClient();
  let games: ProjectedGame[] = [];
  let error = '';
  try {
    const user = await manifestUser(name, code, false);
    await client.connect();
    const db = client.db(process.env.DBNAME as string);
    const gamesCollection = db.collection<Game>(process.env.GAMESCOLLECTION as string);
    const result = await gamesCollection.find({
      user_id: user.id,
      state: { $ne: GameState.active },
    });
    await client.close();
    if (!result) throw new Error(Errors.CantGetGames);
    games = await result
      .sort({ timestamp: -1 }).limit(100)
      .project<ProjectedGame>({ user_id: 0, id: 0 })
      .toArray();
  } catch ({ message }) {
    error = message as string;
  }
  return { games, error };
}
