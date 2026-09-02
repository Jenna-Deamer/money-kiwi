import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCashflowAnalytics } from '@/utils/api/dashboard';
import { useAuth } from '@/context/AuthContext';

export function useCashflowAnalytics(dateRange) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['cashflowAnalytics', dateRange],
    queryFn: () => fetchCashflowAnalytics(dateRange[0], dateRange[1]),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}
