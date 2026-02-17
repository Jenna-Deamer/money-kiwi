import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../../../utils/validation/transactionSchema';

const validTypes = ['INCOME', 'EXPENSE', 'TRANSFER'];


function TransactionForm() {
    const { id } = useParams();
    let isEditMode = false;
    if (id) { isEditMode = true; };

    return (
        <>
            {!isEditMode && <h1>Create Transaction</h1>}
            {isEditMode && <h1>Update Transaction</h1>}
        </>
    );
}

export default TransactionForm;