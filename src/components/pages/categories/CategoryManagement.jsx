import {
  useGroupChildrenCategories,
  useGroupParentCategories,
  useUpdateCategory,
  useDeleteCategory
} from '@/hooks/useCategory';
import TabButtons from '@/components/shared/ui/buttons/TabButtons';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCategorySchema } from '@/utils/validation/categorySchema';
import { HexColorPicker } from 'react-colorful';
import Modal from '@/components/shared/Modal';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function CategoryManagement() {
  const tabs = [
    { id: 'expense', label: 'Expense' },
    { id: 'income', label: 'Income' },
    { id: 'transfer', label: 'Transfer' },
  ];
  const {
    data: {
      groupedParentCategories: {
        INCOME: incomeParentCategories = [],
        EXPENSE: expenseParentCategories = [],
        TRANSFER: transferParentCategories = [],
      } = {},
    } = {},
    isLoading: isLoadingParentCategories,
    error: categoryParentError,
  } = useGroupParentCategories();

  const {
    data: {
      groupedChildrenCategories: {
        INCOME: incomeChildrenCategories = [],
        EXPENSE: expenseChildrenCategories = [],
        TRANSFER: transferChildrenCategories = [],
      } = {},
    } = {},
    isLoading: isLoadingChildrenCategories,
    error: categoryChildrenError,
  } = useGroupChildrenCategories();
  const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();

  const [activeTab, setActiveTab] = useState('expense');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [showDeleteError, setShowDeleteError] = useState(false);

  const { register, handleSubmit, watch, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: '',
      parentId: '',
      color: '',
    }
  });

  if (isLoadingParentCategories || isLoadingChildrenCategories) return <p>Loading...</p>;
  if (categoryParentError || categoryChildrenError) return <p>Error loading categories</p>;

  const currentParentId = watch('parentId');

  function openEditModal(category) {
    setActiveCategory(category);
    reset({
      name: category.name || '',
      parentId: category.parentId || '',
      color: category.color || '',
    });
    setIsEditModalOpen(true);
  };

  function handleClose() {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    updateCategory(
      { ...data, id: activeCategory.id },
      { onSuccess: handleClose }
    );
  };

  function openDeleteModal(category) {
    setActiveCategory(category);
    setIsDeleteModalOpen(true);
  };

  function handleDeleteSubmit(e) {
    e.preventDefault();
    if (!reassignTo) {
      setShowDeleteError(true);
      return;
    };
    setShowDeleteError(false);
    deleteCategory(
      { id: activeCategory.id, reassignTo },
      { onSuccess: handleClose }
    );
  };

  return (
    <>
      <section>
        <div className='flex justify-between pb-1.5'>
          <h1>Your Categories</h1>
          <LinkButton to='/categories/form'>Create Category</LinkButton>
        </div>

        <TabButtons
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'expense' && (
          <div className='pt-4'>
            <h2 className='pb-1.5'>Expense</h2>
            <ul className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2'>
              {expenseParentCategories
                ?.filter(parent => parent.name !== 'Uncategorized')
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((parent) => (
                  <li key={parent.id} className='rounded border p-4'>
                    <div>
                      <h4 className='font-bold'>{parent.name}</h4>
                      <p>{parent.color}</p>
                      <button onClick={() => openEditModal(parent)}>Edit</button>
                      <button onClick={() => openDeleteModal(parent)}>Delete</button>
                    </div>

                    <ul className='mt-2 space-y-1'>
                      {expenseChildrenCategories
                        ?.filter(child => child.parentId === parent.id && child.name !== 'Uncategorized')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((child) => (
                          <li key={child.id} className='ml-2'>
                            {child.name}
                            <button onClick={() => openEditModal(child)}>Edit</button>
                            <button onClick={() => openDeleteModal(child)}>Delete</button>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}

              {expenseParentCategories
                ?.filter(parent => parent.name === 'Uncategorized')
                .map(parent => <li key={parent.id} className='rounded border p-4'> <h4 className='font-bold'>{parent.name}</h4>

                  <ul className='mt-2 space-y-1'>
                    {expenseChildrenCategories?.filter(child => child.parentId === parent.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((child) => (
                        <li key={child.id} className='ml-2'>
                          {child.name}
                          <button onClick={() => openEditModal(child)}>Edit</button>
                          <button onClick={() => openDeleteModal(child)}>Delete</button>
                        </li>
                      ))
                    }

                  </ul>
                </li>)}

            </ul>
          </div>
        )}

        {activeTab === 'income' && (
          <div className='pt-4'>
            <h2 className='pb-1.5'>Income</h2>
            <ul className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2'>
              {incomeParentCategories
                ?.filter(parent => parent.name !== 'Uncategorized')
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((parent) => (
                  <li key={parent.id} className='rounded border p-4'>
                    <div>
                      <h4 className='font-bold'>{parent.name}</h4>
                      <p>{parent.color}</p>
                      <button onClick={() => openEditModal(parent)}>Edit</button>
                      <button onClick={() => openDeleteModal(parent)}>Delete</button>
                    </div>

                    <ul className='mt-2 space-y-1'>
                      {incomeChildrenCategories
                        ?.filter(child => child.parentId === parent.id && child.name !== 'Uncategorized')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((child) => (
                          <li key={child.id} className='ml-2'>
                            {child.name}
                            <button onClick={() => openEditModal(child)}>Edit</button>
                            <button onClick={() => openDeleteModal(child)}>Delete</button>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              {incomeParentCategories
                ?.filter(parent => parent.name === 'Uncategorized')
                .map(parent => <li key={parent.id} className='rounded border p-4'> <h4 className='font-bold'>{parent.name}</h4>

                  <ul className='mt-2 space-y-1'>
                    {incomeChildrenCategories?.filter(child => child.parentId === parent.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((child) => (
                        <li key={child.id} className='ml-2'>
                          {child.name}
                          <button onClick={() => openEditModal(child)}>Edit</button>
                          <button onClick={() => openDeleteModal(child)}>Delete</button>
                        </li>
                      ))
                    }

                  </ul>
                </li>)}
            </ul>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className='pt-4'>
            <h2 className='pb-1.5'>Transfer</h2>
            <ul className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2'>
              {transferParentCategories
                ?.filter(parent => parent.name !== 'Uncategorized')
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((parent) => (
                  <li key={parent.id} className='rounded border p-4'>
                    <div>
                      <h4 className='font-bold'>{parent.name}</h4>
                      <p>{parent.color}</p>
                      <button onClick={() => openEditModal(parent)}>Edit</button>
                      <button onClick={() => openDeleteModal(parent)}>Delete</button>
                    </div>

                    <ul className='mt-2 space-y-1'>
                      {transferChildrenCategories
                        ?.filter(child => child.parentId === parent.id && child.name !== 'Uncategorized')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((child) => (
                          <li key={child.id} className='ml-2'>
                            {child.name}
                            <button onClick={() => openEditModal(child)}>Edit</button>
                            <button onClick={() => openDeleteModal(child)}>Delete</button>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              {transferParentCategories
                ?.filter(parent => parent.name === 'Uncategorized')
                .map(parent => <li key={parent.id} className='rounded border p-4'> <h4 className='font-bold'>{parent.name}</h4>

                  <ul className='mt-2 space-y-1'>
                    {transferChildrenCategories?.filter(child => child.parentId === parent.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((child) => (
                        <li key={child.id} className='ml-2'>
                          {child.name}
                          <button onClick={() => openEditModal(child)}>Edit</button>
                          <button onClick={() => openDeleteModal(child)}>Delete</button>
                        </li>
                      ))
                    }
                  </ul>
                </li>)}
            </ul>
          </div>
        )}
      </section>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleClose}
        title='Edit Category'
        body={
          activeCategory && (
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <h3>Editing {activeCategory.name}</h3>
              <fieldset>
                <label>Name</label>
                <div className='input-group'>
                  <input {...register('name')} placeholder='Housing' />
                  {errors.name && <span className='error'>{errors.name.message}</span>}
                </div>
              </fieldset>
              {activeCategory.parentId && (

                <fieldset>
                  <label>Parent Assignment</label>
                  <select {...register('parentId')}>
                    <option value=''>-- No Parent (top-level) --</option>
                    {activeTab === 'income' ? incomeParentCategories?.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    )) : expenseParentCategories?.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </fieldset>
              )}
              {!currentParentId && (
                <fieldset>
                  <label>Colour</label>
                  <Controller
                    control={control}
                    name='color'
                    render={({ field: { onChange, value } }) => (
                      <HexColorPicker color={value} onChange={onChange} />
                    )}
                  />
                </fieldset>
              )}
              <button type='submit' disabled={isUpdating}>Save Changes</button>
            </form>
          )
        }
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleClose}
        title='Delete Category'
        body={
          activeCategory ? (
            activeCategory.parentId ? (
              <form onSubmit={handleDeleteSubmit}>
                <h3>Deleting <b>Child Category: {activeCategory.name}</b></h3>
                <p>Select a category to reassign its transactions:</p>
                <fieldset>
                  {showDeleteError && <p className='text-red-600'>Error: Please select a category</p>}
                  <select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                    <option value={null}>--- Select Category ---</option>
                    {activeTab === 'income'
                      ? incomeChildrenCategories
                        ?.filter(category => category.parentId === activeCategory.parentId && category.name !== activeCategory.name)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      : expenseChildrenCategories
                        ?.filter(category => category.parentId === activeCategory.parentId && category.name !== activeCategory.name)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                  </select>
                </fieldset>
                <button type='submit' disabled={isDeleting}><b>Delete {activeCategory.name}</b></button>
              </form >
            ) : (
              <form onSubmit={handleDeleteSubmit}>
                <h3>Deleting <b>Parent Category: {activeCategory.name}</b></h3>
                <p>Select a parent category to inherit its child categories:</p>
                <fieldset>
                  {showDeleteError && <p className='text-red-600'>Error: Please select a category</p>}
                  <select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                    <option value={null}>--- Select Category ---</option>
                    {activeTab === 'income'
                      ? incomeParentCategories?.filter(category => category.name !== activeCategory.name)
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      : expenseParentCategories?.filter(category => category.name !== activeCategory.name)
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                  </select>
                </fieldset>
                <button type='submit' disabled={isDeleting}><b>Delete {activeCategory.name}</b></button>
              </form>
            )
          ) : null
        }
      />
    </>
  );
}

export default CategoryManagement;
