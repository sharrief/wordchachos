import { generate } from 'generate-passphrase';
import { Errors } from 'messages/errors';
import { User } from 'types';
import { v4 as uuid } from 'uuid';
import getClient from './getClient';

export async function manifestUser(name: string, code: string, createIfNone = false) {
  const client = getClient();
  if ((!name || !code) && !createIfNone) {
    throw new Error(Errors.NoUserNameOrCode);
  }
  await client.connect();
  const db = client.db(process.env.DBNAME as string);
  const users = db.collection<User>(process.env.USERSCOLLECTION as string);
  const user = await users.findOne({ name, code });
  if (!user?.name || (!code && createIfNone)) {
    const passPhrase = code || `wordchachos-${generate({ length: 2, separator: '-' })}`;
    const result = await users.insertOne({ name, code: passPhrase, id: uuid() });
    if (result?.insertedId) {
      const newUser = await users.findOne({ name, code: passPhrase });
      if (newUser) { return newUser; }
    }
    throw new Error(Errors.CantGetUser);
  }
  await client.close();
  return user;
}
