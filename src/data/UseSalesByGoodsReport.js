import useSWR from 'swr';

export function useSalesByGoodsReport(reportDate, pos) {
  const { data, error, isLoading, mutate } = useSWR('/api/salesByGoodsReport?date='+reportDate+'&pos='+pos);
  return { isLoading, data, error, mutate };
}