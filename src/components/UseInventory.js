import useSWR from 'swr';

export function useInventory(pos) {
  const { data, error, isLoading, mutate } = useSWR('/api/inventory?pos='+pos?._id);
  return { isLoading, data, error, mutate };
}