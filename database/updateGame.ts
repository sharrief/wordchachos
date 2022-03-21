import getClient from 'database/getClient';
import { Errors } from 'messages/errors';
import { CloudGame } from 'types';

export async function updateGame(game: CloudGame) {
  const client = getClient();
  try {
    await client.connect();
    const db = client.db(process.env.DBNAME as string);
    const gamesCollection = db.collection<CloudGame>(process.env.GAMESCOLLECTION as string);
    const result = await gamesCollection.updateOne({
      id: game.id,
    }, {
      $set: game,
    });
    await client.close();
    if (!result.acknowledged) throw new Error(Errors.CantSaveGame);
    return {};
  } catch ({ message }) {
    console.log({ message });
    const error = message as string;
    return { error };
  }
}
