import { getWordleSeed } from 'game/getWordleSeed';
import { api } from 'pages/api/_api';
import { Req, Res } from 'types';

export default function handler<T extends typeof api.fetchWordleSeed>(req: Req<T>, res: Res<T>) {
  try {
    const { year, month, day } = req.body;
    const seed = getWordleSeed(year, month, day);
    res.send({ data: seed });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}