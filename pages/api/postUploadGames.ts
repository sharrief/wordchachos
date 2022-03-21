import { api } from 'pages/api/_api';
import { Req, Res } from 'types';
import { insertManyGames } from 'database/insertManyGames';
import { queryManyGames } from 'database/queryManyGames';
import { Errors } from 'messages/errors';
import { getUserFromCookie } from './_util';

export default async function handler<T extends typeof api.postUploadGames>(req: Req<T>, res: Res<T>) {
  try {
    const { games } = req.body;
    const { name, code } = getUserFromCookie(req);
    if (!games.length) throw new Error(Errors.NoGamesToUpload);
    const { error: updateError } = await insertManyGames(games, name, code);
    if (updateError) throw new Error(updateError);
    const insertedGames = await queryManyGames(name, code);
    res.send({ data: insertedGames });
  } catch ({ message }) {
    res.send({ error: message });
  }
}
