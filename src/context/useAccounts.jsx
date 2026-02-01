import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAccounts, createAccount } from '../utils/api/account';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export function useAccounts(select) {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts,
        select: select,
        // won't run if user isn't auth
        enabled: isAuthenticated
    });
};

export function useCategorizedAccounts() {
    return useAccounts((data) => ({
        banking: data?.filter(a => a.category === 'banking') || [],
        investments: data?.filter(a => a.category === 'investments') || [],
        debt: data?.filter(a => a.category === 'credit') || [],
        archived: data?.filter(a => a.staus === 'archived') || [],
        isEmpty: data?.length === 0
    }));
}

export function useCreateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newAccount) => createAccount(newAccount),
        onSuccess: () => {
            // force-refreshes the account list everywhere in app
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account created succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create account');
        }
    });
};