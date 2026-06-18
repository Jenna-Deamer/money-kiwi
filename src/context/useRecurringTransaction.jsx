import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRecurringTransactionTemplate, fetchRecurringTransactions, updateRecurringTransactionTemplate, updateRecurringTransactionTemplatePauseStatus} from '@/utils/api/recurringTransaction';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';


export function useRecurringTransaction() {
  const { isAuthenticated } = useAuth();

  return useQuery({
      queryKey: ['recurringTemplates'],
      queryFn: fetchRecurringTransactions,
      enabled: isAuthenticated
  });
}

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (updatedTemplate) => updateRecurringTransactionTemplate(updatedTemplate),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
          toast.success('Template updated successfully');
      },
      onError: (error) => {
          toast.error(error.message || 'Failed to update template');
      }
  });
}

export function useUpdateRecurringTransactionPauseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (updatedTemplate) => updateRecurringTransactionTemplatePauseStatus(updatedTemplate),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
          toast.success('Template Status updated successfully');
      },
      onError: (error) => {
          toast.error(error.message || 'Failed to update template status');
      }
  });
}

export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (data) => deleteRecurringTransactionTemplate(data), onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
          toast.success('Template deleted successfully');
      },
      onError: (error) => {
          toast.error(error.message || 'Failed to delete template');
      }
  });
}
