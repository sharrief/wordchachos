import { api } from 'pages/api/_api';
import { Req, Res } from 'types';
import version from 'version';

export default function handler<T extends typeof api.getVersion>(req: Req<T>, res: Res<T>) {
  try {
    res.send({ data: { version } });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}
