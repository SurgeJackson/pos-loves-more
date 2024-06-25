import useSWR from 'swr';

export function useMenuItems(id) {
  const { data, error, isLoading, mutate } = useSWR('/api/menu-items' + (id ? ('?_id='+id) : ""));
  return { isLoading, data, error, mutate };
}