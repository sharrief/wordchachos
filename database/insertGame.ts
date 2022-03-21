import getClient from 'database/getClient';
import { Errors } from 'messages/errors';
import { CloudGame, Game } from 'types';
import { manifestUser } from 'database/queryUser';

export async function insertGame(game: Game, name: string, code: string) {
  const client = getClient();
  try {
    const user = await manifestUser(name, code);
    await client.connect();
    const db = client.db(process.env.DBNAME as string);
    const gamesCollection = db.collection<CloudGame>(process.env.GAMESCOLLECTION as string);
    const result = await gamesCollection.insertOne({ ...game, user_id: user.id });
    await client.close();
    if (!result.acknowledged) throw new Error(Errors.CantSaveGame);
    return { success: true, _id: result.insertedId };
  } catch ({ message }) {
    const error = message as string;
    return { error };
  }
}
