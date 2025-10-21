import useSWR from 'swr';

export function useClients() {
  const { data, error, isLoading, mutate } = useSWR('/api/clients');
  return { isLoading, data, error, mutate };
}