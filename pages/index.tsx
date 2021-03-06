import type { NextPage } from 'next';
import { SWRConfig } from 'swr';
import Home from './[gameType]';

const Index: NextPage = () => (
    <SWRConfig
    value={{
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}>
      <Home />
    </SWRConfig>
);

export default Index;
