import useSWR from 'swr';

export function useProfile(id) {
  const { data, error, isLoading } = useSWR('/api/profile' + (id ? ('?_id='+id) : ""));
  return { isLoading, data, error };
}