import useSWR, { preload } from 'swr';
import fetcher from '@/lib/fetcher';

preload('/api/users', fetcher);

export function useUsers() {
  const { data, error, isLoading } = useSWR('/api/users');
  return { isLoading, data, error };
}