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
    const [selectedCategory, setSelectedCategory] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: { name: '', insutiution: '', category: '', registration: '' }
    });


    const onSubmit = async (data) => {
        setServerError('');
        try {
            await accountApi(data.name, data.insutiution, data.category, data.registration);
            toast.success('Account added');
            navigate('/accounts');
        } catch (err) {
            toast.error('Account creation failed');
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
                    <div className="input-group">
                        <input {...register('name')} placeholder="Name"></input>
                        {errors.name && <span className="error">{errors.name.message}</span>}
                    </div>

                    <label>Insutiution</label>
                    <div className="input-group">
                        <input {...register('insutiution')} placeholder="Insutiution"></input>
                        {errors.insutiution && <span className="error">{errors.insutiution.message}</span>}
                    </div>

                </fieldset>
                <fieldset>
                    <label>Category</label>
                    <div className="input-group">
                        <select {...register('category')}
                            onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">-- Select Purpose --</option>
                            <option value="banking">Banking (Chequing, Savings, Cash)</option>
                            <option value="investments">Investments (Brokerage, Robo-advisors)</option>
                            <option value="credit">Credit & Loans (Cards, LoC, Mortgages)</option>
                        </select>
                        {errors.category && <span className="error">{errors.category.message}</span>}
                    </div>
                    <label>Registration</label>
                    <div className="input-group">
                        <select
                            {...register('registration')}
                            disabled={selectedCategory === 'credit' || !selectedCategory}
                            value={selectedCategory === 'credit' ? 'Non-registered' : undefined}
                        >

                            {!selectedCategory && <option value="">-- Select Category First --</option>}
                            {selectedCategory === 'credit' && <option value="Non-registered">N/A (Not applicable for debt)</option>}
                            {selectedCategory === 'banking' && (
                                <>
                                    <option value="Non-registered">Default</option>
                                    <option value="TFSA">TFSA</option>
                                    <option value="RRSP">RRSP</option>
                                    <option value="FHSA">FHSA</option>
                                </>
                            )}
                            {selectedCategory === 'investments' && (
                                <>
                                    <option value="Non-registered">Non-Reg</option>
                                    <option value="TFSA">TFSA</option>
                                    <option value="RRSP">RRSP</option>
                                    <option value="FHSA">FHSA</option>
                                </>
                            )}

                        </select>
                        {errors.registration && <span className="error">{errors.registration.message}</span>}
                    </div>

                </fieldset>
                <button type="submit">
                    {isSubmitting ? 'Creating Account...' : 'Create'}
                </button>
            </form >
        </>
    );
}

export default AddAccountForm;