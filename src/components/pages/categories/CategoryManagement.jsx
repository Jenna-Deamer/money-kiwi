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
import Button from '@/components/shared/ui/buttons/Button';
import { Pencil, Trash2 } from 'lucide-react';
import OptionsMenu from '@/components/shared/ui/OptionsMenu';
import FormField from '@/components/shared/ui/form/FormField';

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

  const dataArrays = {
    expense: {
      parentCategories: expenseParentCategories,
      childCategories: expenseChildrenCategories
    },
    income: {
      parentCategories: incomeParentCategories,
      childCategories: incomeChildrenCategories
    },
    transfer: {
      parentCategories: transferParentCategories,
      childCategories: transferChildrenCategories
    }
  };

  const [activeTab, setActiveTab] = useState('expense');
  const activeList = dataArrays[activeTab];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

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
  const handleMenuClose = () => setIsOptionsMenuOpen(false);

  const handleOptionsMenu = (child) => {
    if (isOptionsMenuOpen && activeCategory?.id === child.id) {
      setIsOptionsMenuOpen(false);
      setActiveCategory(null);
    } else {
      setActiveCategory(child);
      setIsOptionsMenuOpen(true);
    }
  };

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
    setReassignTo('');
    setShowDeleteError(false);
  };

  const handleEditSubmit = (data) => {
    updateCategory(
      { ...data, id: activeCategory.id },
      { onSuccess: handleClose }
    );
  };

  function openDeleteModal(category) {
    setReassignTo('');
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
        <div className='flex md:flex-row justify-between flex-col gap-2 items-center mb-6'>
          <h1>Your Categories</h1>
          <div>  <LinkButton to='/categories/form'>Create Category</LinkButton></div>
        </div>

        <div className='flex justify-center items-center md:justify-start'>
          <TabButtons
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          /></div>



        <h2 className='mt-6 mb-4'>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
        <ul className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3'>
          {activeList?.parentCategories?.length === 0 ? <div className='card w-fit '><p className='text-txt-muted'>No categories found</p></div> :
            activeList?.parentCategories?.filter(parent => parent.name)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((parent) => (
                <li key={parent.id} className='card-compact border-t-8' style={{ borderColor: parent.color }}>
                  <div className='flex justify-between items-center'>
                    <h4>{parent.name}</h4>

                    <div className='flex gap-2 ml-2'>
                      <button type='button' className='cursor-pointer' onClick={() => openEditModal(parent)} aria-label={`Edit ${parent.name}`}>
                        <Pencil aria-hidden='true' />
                      </button>
                      <button type='button' className='cursor-pointer' onClick={() => openDeleteModal(parent)} aria-label={`Delete ${parent.name}`}>
                        <Trash2 aria-hidden='true' />
                      </button>
                    </div>
                  </div>

                  <ul className='mt-4 border-t pt-4'>
                    {activeList?.childCategories
                      ?.filter(child => child.parentId === parent.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((child) => (
                        <li key={child.id} className='flex items-center justify-between border-b py-1.5 border-soft'>
                          <span>{child.name}</span>
                          <OptionsMenu
                            isOpen={isOptionsMenuOpen && activeCategory?.id === child.id}
                            onClose={handleMenuClose}
                            onTriggerClick={() => handleOptionsMenu(child)}
                          >
                            <li className='mb-1 border-b'>
                              <button onClick={() => openEditModal(child)} aria-label={`Edit ${child.name}`}>
                                Edit
                              </button>
                            </li>
                            <li className='mb-1 border-b'>
                              <button onClick={() => openDeleteModal(child)} aria-label={`Delete ${child.name}`}>
                                Delete
                              </button>
                            </li>
                          </OptionsMenu>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
        </ul>
      </section>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleClose}
        title='Edit Category'
        body={
          activeCategory && (
            <form
              id='edit-category-form'
              onSubmit={handleSubmit(handleEditSubmit)}
              className='space-y-4'
            >
              <p className='text-small text-txt-muted'>
                Update the details for <strong>{activeCategory.name}</strong>.
              </p>


              <FormField
                label='Name'
                htmlFor='name'
                error={errors.name?.message}
              >   <input {...register('name')} placeholder='Housing' className='input-standard' /></FormField>


              {activeCategory.parentId && (
                <FormField
                  label='Parent Category'
                  htmlFor='parent'
                >
                  <select {...register('parentId')} className='input-standard mb-2'>
                    <option value=''>No parent category</option>
                    {activeTab === 'income'
                      ? incomeParentCategories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                      : expenseParentCategories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </FormField>
              )}


              {!currentParentId && (

                <FormField
                  label='Colour'
                  htmlFor='colour'>
                  <Controller
                    control={control}
                    name='color'
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <HexColorPicker color={value} onChange={onChange} />
                        <p className='text-small text-txt-muted italic mt-4'>
                          *This colour will be used for this parent category in charts and other visual&nbsp;summaries.
                        </p>
                      </div>
                    )}
                  />
                </FormField>

              )}
            </form>
          )
        }
        footer={
          activeCategory ? (
            <>
              <Button
                type='submit'
                form='edit-category-form'
                disabled={isUpdating}
              >
                Save Changes
              </Button>
              <Button
                type='button'
                onClick={handleClose}
                intent='subtle'
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </>
          ) : null
        }
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleClose}
        title='Delete Category'
        body={
          activeCategory ? (
            <form
              id='delete-category-form'
              onSubmit={handleDeleteSubmit}
              className='space-y-4'
            >
              {activeCategory.parentId ? (
                <>
                  <div className='space-y-2'>
                    <p>
                      You are deleting <strong>{activeCategory.name}</strong>.
                    </p>
                    <p>
                      Choose another category to move its transactions to before deleting it.
                    </p>
                  </div>

                  <fieldset className='space-y-1.5'>
                    <label>Move transactions to</label>

                    {showDeleteError && (
                      <p className='field-error'>Please select a category.</p>
                    )}
                    <select
                      value={reassignTo}
                      onChange={(e) => setReassignTo(e.target.value)}
                      className='input-standard'
                    >
                      <option value=''>Select a category</option>
                      {activeTab === 'income'
                        ? incomeChildrenCategories
                          ?.filter(
                            (category) =>
                              category.name !== activeCategory.name
                          )
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        : expenseChildrenCategories
                          ?.filter(
                            (category) =>

                              category.name !== activeCategory.name
                          )
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                    </select>

                  </fieldset>
                </>
              ) : (
                <>
                  <div className='space-y-2'>
                    <p>
                      You are deleting <strong>{activeCategory.name}</strong>.
                    </p>
                    <p>
                      Choose another parent category to move its child categories to before deleting it.
                    </p>
                  </div>

                  <fieldset className='space-y-1.5'>
                    <label>Move all categories to</label>
                    <select
                      value={reassignTo}
                      onChange={(e) => setReassignTo(e.target.value)}
                      className='input-standard'
                    >
                      <option value=''>Select a category</option>
                      {activeTab === 'income'
                        ? incomeParentCategories
                          ?.filter((category) => category.name !== activeCategory.name)
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        : expenseParentCategories
                          ?.filter((category) => category.name !== activeCategory.name)
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                    </select>
                    {showDeleteError && (
                      <p className='field-error'>*Please select a category.</p>
                    )}
                  </fieldset>
                </>
              )}
            </form>
          ) : null
        }
        footer={
          activeCategory ? (
            <>
              <Button
                type='submit'
                form='delete-category-form'
                disabled={isDeleting}
                intent='danger'
              >
                Delete Category
              </Button>
              <Button
                type='button'
                onClick={handleClose}
                intent='subtle'
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </>
          ) : null
        }
      />
    </>
  );
}

export default CategoryManagement;
