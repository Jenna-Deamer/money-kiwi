import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "../../../utils/validation/finAccountSchema";
import { toast } from 'sonner';

function AddAccountForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: { name: '', insutiution: '', type: '', registration: '' }
    });


    const onSubmit = async (data) => {
        setServerError('');
        try {
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
                    <input placeholder="Name"></input>
                    <label>Insutiution</label>
                    <input placeholder="Insutution"></input>
                </fieldset>
                <fieldset>
                    <label>Type</label>
                    <select></select>
                    <label>Registration</label>
                    <select></select>
                </fieldset>
                <button type="submit">
                    {isSubmitting ? "Creating Account..." : "Create"}
                </button>
            </form>
        </>
    )
}

export default AddAccountForm;