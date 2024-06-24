import useSWR, { preload } from 'swr';
import fetcher from '@/lib/fetcher';

preload('/api/pos', fetcher);

export function usePoses() {
  const { data, error, isLoading, mutate } = useSWR('/api/pos');
  return { isLoading, data, error, mutate };
}