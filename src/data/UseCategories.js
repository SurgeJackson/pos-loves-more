import useSWR from 'swr';

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR('/api/categories');
  return { isLoading, data, error, mutate };
}