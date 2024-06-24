import useSWR from 'swr';

export function useSalesByGoodsReport(reportDate, pos) {
  const { data, error, isLoading } = useSWR('/api/salesByGoodsReport?date='+reportDate+'&pos='+pos);
  return { isLoading, data, error };
}