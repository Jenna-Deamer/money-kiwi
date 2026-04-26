import { useParentCategories } from '../../../context/useCategory';

function CategoryManagement() {
    const { data: { parentIncomeCategories } = {}, isLoading, error } = useParentCategories();


    return (
        <>
            <section>
                <h1>Your Categories</h1>
                <div>
                    <h2>Expense</h2>
                    <ul>

                    </ul>
                </div>
            </section>
        </>
    );
}

export default CategoryManagement;