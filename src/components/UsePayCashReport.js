import useSWR from 'swr';

export function usePayCashReport(reportDate, pos) {
  const { data, error, isLoading, mutate } = useSWR('/api/payCashReport?date='+reportDate+'&pos='+pos);
  return { isLoading, data, error, mutate };
}