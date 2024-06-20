import useSWR from 'swr';

export function useProfile() {
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data, error, loading } = useSWR('/api/profile', fetcher);
  return { loading, data, error };
}