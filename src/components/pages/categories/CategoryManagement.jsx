import { useParentCategories, useChildrenCategories } from '../../../context/useCategory';
import { Link } from 'react-router-dom';

function CategoryManagement() {
    const { data: { parentCategories: parentIncome = [] } = {}, isLoading,
        error } = useParentCategories('INCOME');
    const { data: { parentCategories: parentExpense = [] } = {} } = useParentCategories('EXPENSE');
    const { data: { childrenCategories: childrenIncome = [] } = {} } = useChildrenCategories('INCOME');
    const { data: { childrenCategories: childrenExpenses = [] } = {} } = useChildrenCategories('EXPENSE');

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading categories</p>;

    return (
        <>
            <section>
                <h1>Your Categories</h1>
                <Link to="/categories/form">Create Category</Link>
                <div>
                    <h2>Expense</h2>
                    <ul>
                        {parentExpense?.map((parent) => (
                            <li key={parent.id}><b>{parent.name}</b>

                                <ul>
                                    {childrenExpenses
                                        ?.filter((child) => child.parentId === parent.id)
                                        .map((child) => (
                                            <li key={child.id}>{child.name}</li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Income</h2>
                    <ul>
                        {parentIncome?.map((parent) => (
                            <li key={parent.id}><b>{parent.name}</b>

                                <ul>
                                    {childrenIncome
                                        ?.filter((child) => child.parentId === parent.id)
                                        .map((child) => (
                                            <li key={child.id}>{child.name}</li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}

export default CategoryManagement;