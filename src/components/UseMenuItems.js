import useSWR, { preload } from 'swr';
import fetcher from '@/lib/fetcher';

preload('/api/menu-items', fetcher);

export function useMenuItems(id) {
  const { data, error, isLoading, mutate } = useSWR('/api/menu-items' + (id ? ('?_id='+id) : ""));
  return { isLoading, data, error, mutate };
}