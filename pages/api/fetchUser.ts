import { manifestUser } from 'database/queryUser';
import { api } from 'pages/api/_api';
import { Errors } from 'messages/errors';
import { Req, Res } from 'types';
import { getUserFromCookie } from './_util';

export default async function handler<T extends typeof api.fetchUser>(req: Req<T>, res: Res<T>) {
  try {
    const { name, code } = getUserFromCookie(req);
    const user = await manifestUser(name, code, !code);
    if (!user?.name) throw new Error(Errors.CantGetUser);
    res.send({ data: user });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}
