import useSWR from 'swr';

export function useInvRequests(pos) {
  const { data, error, isLoading, mutate } = useSWR('/api/invRequest?pos='+pos?._id);
  
  console.log(data);
  return { isLoading, data, error, mutate };
}