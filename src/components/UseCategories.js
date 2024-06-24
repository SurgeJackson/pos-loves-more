import useSWR, { preload } from 'swr';
import fetcher from '@/lib/fetcher';

preload('/api/categories', fetcher);

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR('/api/categories');
  return { isLoading, data, error, mutate };
}