import useSWR from 'swr';

export function useOrders(reportDate, pos) {
  const { data, error, isLoading, mutate } = useSWR('/api/orders?date='+reportDate+'&pos='+pos);
  return { isLoading, data, error, mutate };
}