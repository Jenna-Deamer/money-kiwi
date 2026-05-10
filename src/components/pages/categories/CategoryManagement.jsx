import {
    useParentCategories,
    useChildrenCategories,
} from '../../../context/useCategory';
import { Link } from 'react-router-dom';
import TabButtons from '../../shared/ui/TabButtons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryManagement() {
    const navigate = useNavigate();
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
    const [activeTab, setActiveTab] = useState('expense');

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading categories</p>;

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
                            {parentExpense?.map((parent) => (
                                <li
                                    key={parent.id}
                                    className="rounded border p-4"
                                >
                                    <div>
                                        <h4 className='font-bold'>{parent.name}</h4>
                                        <button onClick={() => navigate(`/categories/form/${parent.id}`)}>Edit</button>
                                    </div>


                                    <ul className="mt-2 space-y-1">
                                        {childrenExpenses
                                            ?.filter((child) => child.parentId === parent.id)
                                            .map((child) => (
                                                <li className='ml-2' key={child.id}>{child.name}</li>
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
                            {parentIncome?.map((parent) => (
                                <li key={parent.id} className="rounded border p-4"
                                >
                                    <b>{parent.name}</b>

                                    <ul className="mt-2 space-y-1">
                                        {childrenIncome
                                            ?.filter((child) => child.parentId === parent.id)
                                            .map((child) => (
                                                <li key={child.id} className='ml-2'>{child.name}</li>
                                            ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </section>
        </>
    );
}

export default CategoryManagement;
