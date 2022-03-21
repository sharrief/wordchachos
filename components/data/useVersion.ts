import { api } from 'api/_api';
import { Labels } from 'messages/labels';
import useSWR from 'swr';

export function useVersion(ver: string) {
  return useSWR(['/getVersion'], async () => {
    console.log(Labels.CheckingForUpdate(ver));
    const { data } = await api.fetchVersion();
    if (data) {
      return data.version;
    }
    return data;
  });
}
