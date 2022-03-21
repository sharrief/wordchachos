import { api } from 'api/_api';
import SWR from 'swr';
import cookies from 'js-cookie';

export function useUser() {
  return SWR(() => {
    const name = cookies.get('name');
    const code = cookies.get('code');
    return `/getUser/?name=${name}&code=${code}}`;
  }, async () => {
    const { data: u } = await api.fetchUser();
    return u;
  });
}
