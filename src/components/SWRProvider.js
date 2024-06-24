'use client';
import { SWRConfig } from 'swr'
import fetcher from '@/lib/fetcher';

export const SWRProvider = ({ children }) => {
  return <SWRConfig
        value={{
          //refreshInterval: 3000,
          fetcher: fetcher,
        }}>
        {children}
    </SWRConfig>
};