import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/utils/validation/categorySchema';
import { HexColorPicker } from 'react-colorful';
import { useCreateCategory, useGetCategory, useUpdateCategory, useParentCategories } from '@/context/useCategory';
import { VALID_TYPES } from '@/utils/data/transactionTypes';

function CategoryForm() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const preSelectedCategory = searchParams.get('catgoryId');
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
        <>
            <h1>{isEditMode ? 'Update Category' : 'Create Category'}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <fieldset>
                    <label>Name</label>
                    <div className='input-group'>
                        <input {...register('name')} placeholder='Housing' />
                        {errors.name && <span className='error'>{errors.name.message}</span>}
                    </div>
                    <label>Type</label>
                    <div className='input-group'>
                        <select {...register('type')}>
                            <option value=''>-- Select Type --</option>
                            {VALID_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && <span className='error'>{errors.type.message}</span>}
                    </div>
                </fieldset>
                <fieldset>
                    <label>Parent Category</label>
                    {!selectedType
                        ? <p>Select a type first.</p>
                        : <>
                            {isLoading && <small>Loading categories...</small>}
                            {error && <small style={{ color: 'red' }}>Error retrieving categories!</small>}
                            <select {...register('parentId')}>
                                <option value=''>-- No Parent (top-level) --</option>
                                {parentCategories?.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </>
                    }
                    {errors.parentId && <span className='error'>{errors.parentId.message}</span>}
                    {selectedParentId
                        ? <p>Only parent categories need a colour.</p>
                        : <> <label>Colour</label>
                            <Controller
                                control={control}
                                name='color'
                                render={({ field: { onChange, value } }) => (
                                    <HexColorPicker color={value} onChange={onChange} />
                                )}
                            />
                        </>
                    }

                    {errors.color && <span className='error'>{errors.color.message}</span>}
                </fieldset>
                <button type='submit' disabled={isCreating || isUpdating || isFetching}>
                    {isEditMode ? 'Update Category' : 'Create Category'}
                </button>
            </form>
        </>
    );
}

export default CategoryForm;
