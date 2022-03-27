import { api } from 'api/_api';
import SWR from 'swr';
import cookies from 'js-cookie';

export function useUser() {
  return SWR(() => {
    const name = cookies.get('name');
    const code = cookies.get('code');
    if (name && code) return `/getUser/?name=${name}&code=${code}}`;
    return false;
  }, async () => {
    const { data: u } = await api.fetchUser();
    return u;
  });
}
