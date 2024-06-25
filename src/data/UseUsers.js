import useSWR from 'swr';

export function useUsers() {
  const { data, error, isLoading } = useSWR('/api/users');
  return { isLoading, data, error };
}