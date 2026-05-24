import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchRecurringTransactions} from '@/utils/api/recurringTransaction';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';


export function useRecurringTransaction() {
  const { isAuthenticated } = useAuth();

  return useQuery({
      queryKey: ['recurringTransaction'],
      queryFn: fetchRecurringTransactions,
      enabled: isAuthenticated
  });
}
