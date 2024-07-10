import useSWR from 'swr';

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR('/api/users');
  return { isLoading, data, error, mutate };
}