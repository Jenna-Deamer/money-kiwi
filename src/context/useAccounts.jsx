import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAccounts, createAccount, getAccount, updateAccount, updateAccountStatus, deleteAccount } from '../utils/api/account';
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

export function useGetAccount(id) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => getAccount(id),
        initialData: () => {
            return queryClient.getQueryData(['accounts'])?.find(acc => acc.id === id);
        },
        enabled: isAuthenticated && !!id,
    });

};

export function useCategorizedAccounts() {
    return useAccounts((data) => ({
        banking: data?.filter(a => a.category === 'banking' && a.status !== 'archived') || [],
        investments: data?.filter(a => a.category === 'investments' && a.status !== 'archived') || [],
        debt: data?.filter(a => a.category === 'credit' && a.status !== 'archived') || [],
        archived: data?.filter(a => a.status === 'archived') || [],
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

export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedAccount) => updateAccount(updatedAccount),
        onSuccess: () => {
            // force-refreshes the account list everywhere in app
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account updated succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update account');
        }
    });

}

export function useUpdateAccountStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedAccount) => updateAccountStatus(updatedAccount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account status updated succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update account status');
        }
    });
}

export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => deleteAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account deleted succesfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete account');
        }
    });
}