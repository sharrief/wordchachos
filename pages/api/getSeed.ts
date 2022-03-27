import { getWotDSeed } from 'game/getSeeds';
import { api } from 'pages/api/_api';
import { Req, Res } from 'types';

export default function handler<T extends typeof api.getWotDSeed>(req: Req<T>, res: Res<T>) {
  try {
    const {
      year, month, day, gameType,
    } = req.body;
    const seed = getWotDSeed(year, month, day, gameType);
    res.send({ data: seed });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}
