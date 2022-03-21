import getClient from 'database/getClient';
import { Errors } from 'messages/errors';
import { CloudGame, Game, GameState } from 'types';
import { manifestUser } from 'database/queryUser';

export async function insertManyGames(games: Game[], name: string, code: string) {
  if (!games?.length) return { success: true };
  const client = getClient();
  try {
    const user = await manifestUser(name, code, true);
    await client.connect();
    const db = client.db(process.env.DBNAME as string);
    const gamesCollection = db.collection<CloudGame>(process.env.GAMESCOLLECTION as string);
    const existingGames = await gamesCollection.find({ user_id: user.id, id: { $in: games.map(({ id }) => id) } }).toArray();
    // TODO consider using projection instead
    const existingGameIds = existingGames.map(({ id }) => id);
    const gamesToInsert = games.filter((g) => g.state !== GameState.active && !existingGameIds.includes(g.id)).map((g) => ({ ...g, user_id: user.id }));
    const result = await gamesCollection.insertMany(gamesToInsert);
    await client.close();
    if (!result.acknowledged) throw new Error(Errors.CantSaveGames);
    return { success: true };
  } catch ({ message }) {
    const error = message as string;
    return { error };
  }
}
