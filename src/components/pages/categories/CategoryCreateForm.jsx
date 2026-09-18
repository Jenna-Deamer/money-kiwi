import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/utils/validation/categorySchema';
import { HexColorPicker } from 'react-colorful';
import { useCreateCategory, useGetCategory, useUpdateCategory, useParentCategories } from '@/hooks/useCategory';
import { VALID_TYPES } from '@/utils/data/transactionTypes';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';

function CategoryForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preSelectedCategory = searchParams.get('categoryId');
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, reset, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryId: preSelectedCategory || '',
      name: '',
      type: '',
      parentId: '',
      color: '',
    }
  });

  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { data: existingCategory, isLoading: isFetching } = useGetCategory(id);

  const selectedParentId = watch('parentId');
  const selectedType = watch('type');

  const { data: { parentCategories } = {}, isLoading, error } = useParentCategories(selectedType);

  useEffect(() => {
    if (isEditMode && existingCategory) {
      reset(existingCategory);
    }
  }, [isEditMode, existingCategory, reset]);

  useEffect(() => {
    if (selectedParentId) setValue('color', '');

  }, [selectedParentId, setValue]);

  useEffect(() => {
    if (!selectedType) setValue('parentId', '');
  }, [selectedType, setValue]);

  const onSubmit = async (formData) => {
    setServerError('');
    const mutation = isEditMode ? updateCategory : createCategory;
    const payload = isEditMode ? { ...formData, id } : formData;

    mutation(payload, {
      onSuccess: () => navigate('/categories'),
      onError: (err) => setServerError(err.message)
    });
  };

  return (
    <section className='flex flex-col items-center justify-center h-full'>
      <div className='card w-full max-w-sm'>
        <h1 className='mb-2 text-center'>{isEditMode ? 'Update Category' : 'Create Category'}</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && <p className='form-error'>{serverError}</p>}
          <fieldset>
            <FormField
              label='Name'
              htmlFor='name'
              error={errors.name?.message}
            >
              <input id='name' {...register('name')} placeholder='Housing' className='input-standard' />
            </FormField>
            <FormField
              label='Type'
              htmlFor='type'
              error={errors.type?.message}
            >
              <select id='type' {...register('type')} className='input-standard'>
                <option value=''>-- Select Type --</option>
                {VALID_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
          </fieldset>

          <fieldset>
            <FormField
              label='Select Parent Category'
              htmlFor='parentId'
              error={errors.parentId?.message}>

              {isLoading && <small className='text-xs text-txt-muted'>Loading categories...</small>}
              {error && <small className='field-error'>Error retrieving categories!</small>}
              <select id='parentId' {...register('parentId')} className='input-standard' disabled={isFetching || isUpdating || isCreating || !selectedType}>
                <option value=''>-- No Parent (top-level) --</option>
                {parentCategories?.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

            </FormField>

            <FormField
              label='Category Colour'
              htmlFor='category-colour'
              error={errors.color?.message}
            >
              {selectedParentId
                ? <p>Only parent categories need a colour.</p>
                :
                <Controller
                  control={control}
                  name='color'
                  render={({ field: { onChange, value } }) => (
                    <HexColorPicker color={value} onChange={onChange} className='mt-2' />
                  )}
                />
              }
            </FormField>
          </fieldset>
          <div className='mt-6 flex justify-center'>
            <Button
              type='submit'
              isLoading={isCreating || isUpdating || isFetching}
              loadingText={isEditMode ? 'Updating Category...' : 'Creating Category...'}
            >
              {isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CategoryForm;
