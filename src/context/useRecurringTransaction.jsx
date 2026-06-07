import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRecurringTransactions, updateReccuringTransactionTemplate} from '@/utils/api/recurringTransaction';
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

export function useUpdateReccuringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (updatedTemplate) => updateReccuringTransactionTemplate(updatedTemplate),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['recurringTransaction'] });
          toast.success('Template updated succesfully');
      },
      onError: (error) => {
          toast.error(error.message || 'Failed to update template');
      }
  });
}
