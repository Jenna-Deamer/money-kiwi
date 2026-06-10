import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recurringTemplateSchema } from '@/utils/validation/recurringTemplateSchema';
import { useUpdateRecurringTransaction } from '@/context/useRecurringTransaction';
import { useChildrenCategories } from '@/context/useCategory';
import { useAccounts } from '@/context/useAccounts';
import { toLocalDateString, stringToDateObject } from '@/utils/dateHelper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import { VALID_TYPES } from '@/utils/data/transactionTypes';
import { useEffect } from 'react';

function UpdateTemplateForm({ template, onClose }) {
  const [serverError, setServerError] = useState('');

  const { data: accountData, isLoading: isLoadingAccounts, error } = useAccounts();
  const { mutate: updateTemplate, isLoading: isUpdating } = useUpdateRecurringTransaction();

  const { register, handleSubmit, setValue, control, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(recurringTemplateSchema),
    defaultValues: {
      accountId: '',
      memo: '',
      type: '',
      amount: '',
      startDate: new Date(),
      categoryId: '',
      toAccountId: '',
      frequency: '',
      endDate: null,
      isPaused: false,
    },
  });

  const selectedType = watch('type');
  const sourceAccountId = watch('accountId');

  const { data: { childrenCategories } = {}, isLoading: isLoadingCategories, error: categoryError } = useChildrenCategories(selectedType);

  useEffect(() => {
    if (!template) return;
    if (!template.startDate) return;
    const normalized = { ...template };

    normalized.amount = normalized.amount.toFixed(2);
    normalized.startDate = stringToDateObject(normalized.startDate);
    normalized.endDate = stringToDateObject(normalized.endDate);

    reset(normalized);

  }, [template, reset]);

  useEffect(() => {
    if (selectedType !== 'TRANSFER') {
      setValue('toAccountId', '');
    }
  }, [selectedType, setValue]);

  const onSubmit = async (formData) => {
    setServerError('');

    // convert dates back to str for backend
    const formattedStartDate = formData.startDate instanceof Date
      ? toLocalDateString(formData.startDate)
      : formData.startDate;
    const formattedEndDate = formData.endDate instanceof Date
      ? toLocalDateString(formData.endDate)
      : formData.endDate;

    const payload = { ...formData, id: template.id, startDate: formattedStartDate, endDate: formattedEndDate }

    updateTemplate(payload, {
      onSuccess: () => onClose(),
      onError: (error) => setServerError(error.message)
    })
  };

  if (isLoadingAccounts || isLoadingCategories) return <p>Loading template details...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

      <fieldset>
        <div>
          <label>Source Account</label>
          {isLoadingAccounts && <small>Loading...</small>}
          {error && <small style={{ color: 'red' }}>Error retrieving accounts!</small>}
        </div>

        <div className='input-group'>
          <select {...register('accountId')} disabled={isLoadingAccounts || !!error}>
            <option value=''>-- Select Source Account --</option>
            {accountData?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          {errors.accountId && <span className='error'>{errors.accountId.message}</span>}
        </div>
      </fieldset>

      <fieldset>
        <label>Memo</label>
        <div className='input-group'>
          <input {...register('memo')} placeholder='e.g. Starbucks' />
          {errors.memo && <span className='error'>{errors.memo.message}</span>}
        </div>

        <label>Amount</label>
        <div className='input-group'>
          <input type='number' step="0.01" {...register('amount')} placeholder='0.00' />
          {errors.amount && <span className='error'>{errors.amount.message}</span>}
        </div>
      </fieldset>

      <fieldset>
        <label>Transaction Type</label>
        <div className='input-group'>
          <select {...register('type')}>
            <option value=''>-- Select Type --</option>
            {VALID_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <span className='error'>{errors.type.message}</span>}
        </div>

        {selectedType !== 'TRANSFER' && (
          <>
            <label>Category</label>

            <div className='input-group'>
              {isLoadingCategories && <small>Loading categories...</small>}
              {categoryError && <small style={{ color: 'red' }}>Error retrieving categories!</small>}
              <select {...register('categoryId')} disabled={!selectedType}>
                {!selectedType ? (
                  <option value=''>-- Select Type First --</option>
                ) : (
                  <>
                    <option value=''>-- Select Category --</option>
                    {childrenCategories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.categoryId && <span className='error'>{errors.categoryId.message}</span>}
            </div>
          </>
        )}
      </fieldset>

      {selectedType === 'TRANSFER' && (
        <fieldset>
          <div>
            <label>Destination Account</label>
            {isLoadingAccounts && <small>Loading accounts...</small>}
            {error && <small style={{ color: 'red' }}>Error retrieving accounts!</small>}
          </div>

          <div className='input-group'>
            <select {...register('toAccountId')} disabled={isLoadingAccounts || !!error}>
              <option value=''>-- Select Destination Account --</option>
              {accountData?.filter(acc => acc.id !== sourceAccountId)
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
            </select>
            {errors.toAccountId && (
              <span className='error'>{errors.toAccountId.message}</span>
            )}
          </div>
        </fieldset>
      )}

      <fieldset>
        <label>Start Date</label>
        <div className='input-group'>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                onChange={onChange}
                onBlur={onBlur}
                selected={value}
                inputRef={ref}
                dateFormat="dd MMM yyyy"
                placeholderText="Select date"
              />
            )}
          />
          {errors.startDate && <span className='error'>{errors.startDate.message}</span>}
        </div>
      </fieldset>

      <fieldset>
        <label>Frequency</label>
        <select {...register('frequency')}>
          <option value=''>-- Select Frequency --</option>
          {FREQUENCIES?.map((freq) => (
            <option key={freq.label} value={freq.value}>{freq.label}</option>
          ))}
        </select>
        {errors.frequency && (
          <span className='error'>{errors.frequency.message}</span>
        )}
      </fieldset>
      <fieldset>
        <label>End Date <small>(optional)</small></label>
        <div className='input-group'>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                onChange={onChange}
                onBlur={onBlur}
                selected={value}
                inputRef={ref}
                dateFormat="dd MMM yyyy"
                placeholderText="Select end date"
              />
            )}
          />
          {errors.endDate && <span className='error'>{errors.endDate.message}</span>}
        </div>
      </fieldset>

      <button type='submit' disabled={isUpdating || isLoadingAccounts || isLoadingCategories}>
        Update Template
      </button>
    </form>
  )
}

export default UpdateTemplateForm;
