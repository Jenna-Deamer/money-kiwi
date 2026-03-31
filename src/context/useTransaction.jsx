import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { createTransaction, fetchTransactions, updateTransaction, getTransaction, deleteTransaction, updateMultipleTransactions } from '../utils/api/transaction';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export function useTransactions(filters, page) {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ['transactions', filters, page],
        queryFn: () => fetchTransactions(filters, page),
        enabled: isAuthenticated,
        placeholderData: keepPreviousData,
    });
}

export function useGetTransaction(id) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['transactions', id],
        queryFn: () => getTransaction(id),
        initialData: () => {
            return queryClient.getQueryData(['transactions'])?.find(transactions => transactions.id === id);
        },
        enabled: isAuthenticated && !!id,
    });
}

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newTransaction) => createTransaction(newTransaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transaction created succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create transaction');
        }
    });
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedTransaction) => updateTransaction(updatedTransaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transaction updated succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update transaction');
        }
    });
}

export function useUpdateMultipleTransactionss() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedTransactions) => updateMultipleTransactions(updatedTransactions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transactions updated succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update transactions');
        }
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => deleteTransaction(data), onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transaction deleted succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete transaction');
        }
    });
}