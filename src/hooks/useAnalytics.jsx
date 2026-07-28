import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCashflowAnyaltics } from '@/utils/api/dashboard';
import { useAuth } from '@/context/AuthContext';

export function useCashflowAnalytics(start, end) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['cashflowAnalytics', start, end],
    queryFn: () => fetchCashflowAnyaltics(start, end),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}
