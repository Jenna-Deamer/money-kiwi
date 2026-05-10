import {
    useParentCategories,
    useChildrenCategories,
    useUpdateCategory,
    useDeleteCategory
} from '../../../context/useCategory';
import { Link } from 'react-router-dom';
import TabButtons from '../../shared/ui/TabButtons';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCategorySchema } from '../../../utils/validation/categorySchema';
import { HexColorPicker } from 'react-colorful';
import Modal from '../../shared/Modal';

function CategoryManagement() {
    const {
        data: { parentCategories: parentIncome = [] } = {},
        isLoading,
        error,
    } = useParentCategories('INCOME');
    const { data: { parentCategories: parentExpense = [] } = {} } =
        useParentCategories('EXPENSE');
    const { data: { childrenCategories: childrenIncome = [] } = {} } =
        useChildrenCategories('INCOME');
    const { data: { childrenCategories: childrenExpenses = [] } = {} } =
        useChildrenCategories('EXPENSE');
    const tabs = [
        { id: 'expense', label: 'Expense' },
        { id: 'income', label: 'Income' },
    ];
    const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();
    const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();

    const [activeTab, setActiveTab] = useState('expense');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const { register, handleSubmit, watch, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            name: '',
            parentId: '',
            color: '',
        }
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading categories</p>;

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
        const form = e.target;
        const selectedCategoryId = form.elements[0].value;
        deleteCategory(
            { id: activeCategory.id, reassignTo: selectedCategoryId },
            { onSuccess: handleClose }
        );
    };

    return (
        <>
            <section>
                <h1>Your Categories</h1>
                <Link to="/categories/form">Create Category</Link>
                <TabButtons
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {activeTab === 'expense' && (
                    <div>
                        <h2>Expense</h2>
                        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
                            {parentExpense
                                ?.filter(parent => parent.name !== 'Uncategorized')
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((parent) => (
                                    <li key={parent.id} className="rounded border p-4">
                                        <div>
                                            <h4 className='font-bold'>{parent.name}</h4>
                                            <p>{parent.color}</p>
                                            <button onClick={() => openEditModal(parent)}>Edit</button>
                                            <button onClick={() => openDeleteModal(parent)}>Delete</button>
                                        </div>

                                        <ul className="mt-2 space-y-1">
                                            {childrenExpenses
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
                        </ul>
                    </div>
                )}

                {activeTab === 'income' && (
                    <div>
                        <h2>Income</h2>
                        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
                            {parentIncome
                                ?.filter(parent => parent.name !== 'Uncategorized')
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((parent) => (
                                    <li key={parent.id} className="rounded border p-4">
                                        <div>
                                            <h4 className='font-bold'>{parent.name}</h4>
                                            <p>{parent.color}</p>
                                            <button onClick={() => openEditModal(parent)}>Edit</button>
                                            <button onClick={() => openDeleteModal(parent)}>Delete</button>
                                        </div>

                                        <ul className="mt-2 space-y-1">
                                            {childrenIncome
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
                                        {activeTab === 'income' ? parentIncome?.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )) : parentExpense?.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </fieldset>
                            )}
                            {!currentParentId && (
                                <fieldset>
                                    <label>Color</label>
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
                title="Delete Category"
                body={
                    activeCategory ? (
                        activeCategory.parentId ? (
                            <form onSubmit={handleDeleteSubmit}>
                                <h3>Deleting <b>Child Category: {activeCategory.name}</b></h3>
                                <p>Select a category to reassign its transactions:</p>
                                <fieldset>
                                    <select>
                                        <option value=''>Uncategorized</option>
                                        {activeTab === 'income'
                                            ? childrenIncome
                                                ?.filter(category => category.parentId === activeCategory.parentId)
                                                .map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))
                                            : childrenExpenses
                                                ?.filter(category => category.parentId === activeCategory.parentId)
                                                .map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                    </select>
                                </fieldset>
                                <button type='submit' disabled={isDeleting}><b>Delete {activeCategory.name}</b></button>
                            </form>
                        ) : (
                            <form onSubmit={handleDeleteSubmit}>
                                <h3>Deleting <b>Parent Category: {activeCategory.name}</b></h3>
                                <p>Select a parent category to inherit its child categories:</p>
                                <fieldset>
                                    <select>
                                        <option value=''>Uncategorized</option>
                                        {activeTab === 'income'
                                            ? parentIncome.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                            : parentExpense.map(category => (
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
