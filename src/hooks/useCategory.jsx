import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, deleteCategory, fetchCategories, getCategory, updateCategory } from '@/utils/api/category';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';


export function useCategories(select) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    select: select,
    enabled: isAuthenticated,
  });
}
export function useGroupParentCategories() {
  return useCategories((data) => ({
    groupedParentCategories: {
      INCOME: data?.filter((a) => a.parentId === null && a.type === 'INCOME') || [],
      EXPENSE: data?.filter((a) => a.parentId === null && a.type === 'EXPENSE') || [],
      TRANSFER: data?.filter((a) => a.parentId === null && a.type === 'TRANSFER') || [],
    },
  }));
};

export function useGroupChildrenCategories() {
  return useCategories((data) => ({
    groupedChildrenCategories: {
      INCOME: data?.filter((a) => !!a.parentId && a.type === 'INCOME') || [],
      EXPENSE: data?.filter((a) => !!a.parentId && a.type === 'EXPENSE') || [],
      TRANSFER: data?.filter((a) => !!a.parentId && a.type === 'TRANSFER') || [],
    },
  }));
}

export function useParentCategories(type) {
  return useCategories((data) => ({
    parentCategories: data?.filter(a => a.parentId === null && a.type === type) || [],
  }));
}

export function useChildrenCategories(type) {
  return useCategories((data) => ({
    childrenCategories: data?.filter(a => !!a.parentId && a.type === type) || [],
  }));
}

export function useGetCategory(id) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategory(id),
    initialData: () => {
      return queryClient.getQueryData(['categories'])?.categories?.find(cat => cat.id === id);
    },
    enabled: isAuthenticated && !!id,
  });

}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory) => createCategory(newCategory),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedCategory) => updateCategory(updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deletedCategory) => deleteCategory(deletedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category');
    }
  });
}
