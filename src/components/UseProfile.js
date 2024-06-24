import useSWR from 'swr';

export function useProfile() {
  const { data, error, isLoading } = useSWR('/api/profile');
  return { isLoading, data, error };
}