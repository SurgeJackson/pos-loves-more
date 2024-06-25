import useSWR from 'swr';

export function usePoses() {
  const { data, error, isLoading, mutate } = useSWR('/api/pos');
  return { isLoading, data, error, mutate };
}