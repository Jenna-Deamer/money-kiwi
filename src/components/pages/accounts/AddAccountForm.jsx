import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '../../../utils/validation/finAccountSchema';
import { createAccount as accountApi } from '../../../utils/api/account';
import { toast } from 'sonner';

function AddAccountForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');


    const { register, handleSubmit, watch,
        setValue, formState: { errors, isSubmitting } } = useForm({
            resolver: zodResolver(accountSchema),
            defaultValues: { name: '', institution: '', category: '', registration: '' }
        });


    const selectedCategory = watch('category');

    const onSubmit = async (data) => {
        setServerError('');
        try {
            await accountApi(data.name, data.institution, data.category, data.registration);
            toast.success('Account added');
            navigate('/accounts');
        } catch (err) {
            toast.error(err.message || 'Account creation failed');
            setServerError(err.message);
        }
    };

    return (
        <>
            <h1>Add New Account</h1>
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

                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Create'}
                </button>
            </form >
        </>
    );
}

export default AddAccountForm;