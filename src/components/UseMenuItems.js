import useSWR, { preload } from 'swr';
import fetcher from '@/lib/fetcher';

preload('/api/menu-items', fetcher);

export function useMenuItems() {
  const { data, error, isLoading, mutate } = useSWR('/api/menu-items');
  return { isLoading, data, error, mutate };
}