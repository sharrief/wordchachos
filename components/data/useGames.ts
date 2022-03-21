import { api } from 'api/_api';
import { getLocalGames } from 'localStorage/getLocalGames';
import SWR from 'swr';
import { User } from 'types';

export function useGames(user?: User) {
  return SWR(['/api/fetchGames', user?.name], async (_r, name) => {
    const localGames = getLocalGames();
    if (name) {
      const { data, error } = await api.fetchGames();
      if (error) throw new Error(error);
      /** dedupe */
      const uniqueLocalGames = localGames.filter((g) => !data?.map(({ id }) => id).includes(g.id));
      if (data) {
        return [...uniqueLocalGames, ...data];
      }
    }
    return localGames;
  });
}
