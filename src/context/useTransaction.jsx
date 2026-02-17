import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTransactions } from '../utils/api/transaction';
import { useAuth, getTransaction } from './AuthContext';
import { toast } from 'sonner';

export function useTransactions(select) {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
        select: select,
        enabled: isAuthenticated
    });
}

export function useTransaction(id) {
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