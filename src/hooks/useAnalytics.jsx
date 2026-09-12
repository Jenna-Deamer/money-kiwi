import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCashflowAnalytics, fetchInvestmentsSummary } from '@/utils/api/dashboard';
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

export function useInvestmentsAnalytics(dateRange) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['investmentsAnalytics', dateRange],
    queryFn: () => fetchInvestmentsSummary(dateRange[0], dateRange[1]),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
}
