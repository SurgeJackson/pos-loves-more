import useSWR from 'swr';

export function useProfile(id) {
  const { data, error, isLoading, mutate } = useSWR('/api/profile' + (id ? ('?_id='+id) : ""));
  return { isLoading, data, error, mutate };
}