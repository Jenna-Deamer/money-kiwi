import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '../../../utils/validation/finAccountSchema';
import { useCreateAccount, useGetAccount, useUpdateAccount } from '../../../context/useAccounts';

const validSubCategories = {
    banking: ['cash', 'chequing', 'high_interest_savings', 'savings'],
    investments: ['brokerage', 'crypto', 'gic', 'mutual_fund', 'pension', 'robo_advisor'],
    credit: ['auto_loan', 'credit_card', 'line_of_credit', 'mortgage', 'personal_loan', 'student_loan']
};

function AccountForm() {
    const { id } = useParams();
    let isEditMode = false;
    if (id) { isEditMode = true; };

    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const { mutate: createAccount, isLoading: isCreating } = useCreateAccount();
    const { mutate: updateAccount, isLoading: isUpdating } = useUpdateAccount();
    const { data: existingAccount, isLoading: isFetching } = useGetAccount(id);


    const { register, handleSubmit, watch, reset,
        setValue, formState: { errors } } = useForm({
            resolver: zodResolver(accountSchema),
            defaultValues: { name: '', institution: '', category: '', subCategory: '', registration: '' }
        });


    const selectedCategory = watch('category');

    useEffect(() => {
        if (isEditMode && existingAccount) {
            reset(existingAccount);
        };
    }, [isEditMode, existingAccount, reset]);

    const onSubmit = async (data) => {
        setServerError('');


        const mutation = isEditMode ? updateAccount : createAccount;

        const payload = isEditMode ? { ...data, id } : data;

        mutation(payload, {
            onSuccess: () => navigate('/accounts'),
            onError: (err) => setServerError(err.message)
        });
    };

    if (isEditMode && isFetching) {
        return <p>Loading account details...</p>;
    }
    return (
        <>
            {!isEditMode && <h1>Add New Account</h1>}
            {isEditMode && <h1>Update Account</h1>}


            <form onSubmit={handleSubmit(onSubmit)}>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <fieldset>
                    <label>Account Name</label>
                    <div className='input-group'>
                        <input {...register('name')} placeholder='Name' />
                        {errors.name && <span className='error'>{errors.name.message}</span>}
                    </div>

                    <label>Institution</label>
                    <div className='input-group'>
                        <input {...register('institution')} placeholder='Institution' />
                        {errors.institution && <span className='error'>{errors.institution.message}</span>}
                    </div>

                </fieldset>
                <fieldset>
                    <label>Category</label>
                    <div className='input-group'>
                        <select
                            {...register('category', {
                                onChange: (e) => {
                                    const val = e.target.value;
                                    // Set the dependent value immediately on change
                                    if (val === 'credit') {
                                        setValue('registration', 'N/A');
                                    } else if (val) {
                                        setValue('registration', 'Non-registered');
                                    } else {
                                        setValue('registration', '');
                                    }
                                }
                            })}
                        >
                            <option value=''>-- Select Purpose --</option>
                            <option value='banking'>Banking</option>
                            <option value='investments'>Investments</option>
                            <option value='credit'>Credit & Loans</option>
                        </select>
                        {errors.category && <span className='error'>{errors.category.message}</span>}
                    </div>

                    <label>Sub-Category</label>
                    <div className='input-group'>
                        <select {...register('subCategory')} disabled={!selectedCategory}>
                            {!selectedCategory ? (
                                <option value=''>-- Select Category First --</option>
                            ) : (
                                <>
                                    <option value=''>-- Select Type --</option>
                                    {validSubCategories[selectedCategory].map((sub) => (
                                        <option key={sub} value={sub}>
                                            {sub.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {errors.subCategory && <span className='error'>{errors.subCategory.message}</span>}
                    </div>
                </fieldset>
                <fieldset>
                    <label>Registration</label>
                    <div className='input-group'>
                        <select
                            {...register('registration')}
                        >
                            {!selectedCategory && <option value=''>-- Select Category First --</option>}
                            {selectedCategory === 'credit' && <option value='N/A'>N/A (Not applicable for debt)</option>}
                            {selectedCategory === 'banking' && (
                                <>
                                    <option value='Non-registered'>Default</option>
                                    <option value='TFSA'>TFSA</option>
                                    <option value='RRSP'>RRSP</option>
                                    <option value='FHSA'>FHSA</option>
                                </>
                            )}
                            {selectedCategory === 'investments' && (
                                <>
                                    <option value='Non-registered'>Non-Reg</option>
                                    <option value='TFSA'>TFSA</option>
                                    <option value='RRSP'>RRSP</option>
                                    <option value='FHSA'>FHSA</option>
                                </>
                            )}
                        </select>
                        {errors.registration && <span className='error'>{errors.registration.message}</span>}
                    </div>
                </fieldset>
                <button type='submit' disabled={isCreating || isUpdating || isFetching}>
                    {isEditMode ? 'Update Account' : 'Create Account'}
                </button>
            </form >
        </>
    );
}

export default AccountForm;