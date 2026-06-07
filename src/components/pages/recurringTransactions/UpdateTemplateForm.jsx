import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recurringTemplateSchema } from '@/utils/validation/recuringTemplateSchema';
import { useUpdateReccuringTransaction } from '@/context/useRecurringTransaction';
import { useChildrenCategories } from '@/context/useCategory';
import { useAccounts } from '@/context/useAccounts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';

function UpdateTemplateForm() {
  const [serverError, setServerError] = useState('');
  return (
    <form>

    </form>
  )
}

export default UpdateTemplateForm;
