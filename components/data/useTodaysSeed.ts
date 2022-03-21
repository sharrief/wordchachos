import { api } from 'api/_api';
import { Errors } from 'messages/errors';
import useSWR from 'swr';
import { SimpleDate } from 'types';

const devLog = process.env.NEXT_PUBLIC_DEVLOG;

export function useTodaysSeed<D extends SimpleDate>(date: D) {
  const { year: y, month: m, day: d } = date;
  /** SWR will cache the seed using with key seedDate */
  return useSWR(['useTodaysSeed', y, m, d], async (_r, year, month, day) => {
    const log = (msg: string) => devLog && console.log(`useTodaysSeed: ${msg}`);
    log(`Fetching wordle seed for ${month}/${day}/${year}`);
    const { data, error } = await api.fetchWordleSeed({ year, month, day });
    if (error || data == null) {
      throw new Error(error || Errors.CantGetSeed);
    }
    log(`Wordle seed for ${month}/${day}/${year} is ${data}`);
    // setSeedDate({ year, month, day });
    return data;
  });
}
