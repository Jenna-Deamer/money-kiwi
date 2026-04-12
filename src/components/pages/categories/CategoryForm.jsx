import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const validTypes = ['INCOME', 'EXPENSE'];

function CategoryForm() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const preSelectedCategory = searchParams.get('catgoryId');

    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    return (
        <>
            <h1>Category Form</h1>
            <form>
                <fieldset>
                    <label>Name</label>
                    <label>Type</label>
                </fieldset>

                <fieldset>
                    <label>Parent Category</label>
                    <label>Color</label>
                </fieldset>

                <button type='submit'>Submit</button>
            </form>
        </>
    );
}

export default CategoryForm;