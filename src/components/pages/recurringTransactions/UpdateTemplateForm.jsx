import { useState } from 'react';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recurringTemplateSchema } from '@/utils/validation/recurringTemplateSchema';
import { useUpdateRecurringTransaction } from '@/hooks/useRecurringTransaction';
import { useChildrenCategories } from '@/hooks/useCategory';
import { useAccounts } from '@/hooks/useAccounts';
import { formatDateToIso, parseIsoDateToLocalDate } from '@/utils/dateHelper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import { VALID_TYPES } from '@/utils/data/transactionTypes';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';

function UpdateTemplateForm({ template, onClose }) {
  const [serverError, setServerError] = useState('');

  const { data: accountData, isLoading: isLoadingAccounts, error } = useAccounts();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateRecurringTransaction();

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
    normalized.startDate = parseIsoDateToLocalDate(normalized.startDate);
    normalized.endDate = parseIsoDateToLocalDate(normalized.endDate);

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
      ? formatDateToIso(formData.startDate)
      : formData.startDate;
    const formattedEndDate = formData.endDate instanceof Date
      ? formatDateToIso(formData.endDate)
      : formData.endDate;

    const payload = { ...formData, id: template.id, startDate: formattedStartDate, endDate: formattedEndDate };

    updateTemplate(payload, {
      onSuccess: () => onClose(),
      onError: (error) => setServerError(error.message)
    });
  };

  if (isLoadingAccounts || isLoadingCategories) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className='form-error' role='alert'>
          <p>{serverError}</p>
        </div>
      )}

      <fieldset>
        {isLoadingAccounts && <small className='text-xs text-txt-muted'>Loading...</small>}
        {error && <small className='field-error'>Error retrieving accounts!</small>}
        <FormField
          label='Source Account'
          htmlFor='accountId'
          error={errors.accountId?.message}
        >
          <select id='accountId' {...register('accountId')} disabled={isLoadingAccounts || !!error} className='input-standard'>
            <option value=''>-- Select Source Account --</option>
            {accountData?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </FormField>
      </fieldset>

      <fieldset>
        <FormField
          label='Memo'
          htmlFor='memo'
          error={errors.memo?.message}
        >
          <input id='memo' {...register('memo')} placeholder='e.g. Starbucks' className='input-standard' />
        </FormField>

        <FormField
          label='Amount'
          htmlFor='amount'
          error={errors.amount?.message}
        >
          <input id='amount' type='number' step='0.01' {...register('amount')} placeholder='0.00' className='input-standard' />
        </FormField>
      </fieldset>

      <fieldset>
        <FormField
          label='Transaction Type'
          htmlFor='type'
          error={errors.type?.message}
        >
          <select id='type' {...register('type')} className='input-standard'>
            <option value=''>-- Select Type --</option>
            {VALID_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </FormField>


        {selectedType !== 'TRANSFER' && (
          <>
            {isLoadingCategories && <small className='text-xs text-txt-muted'>Loading categories...</small>}
            {categoryError && <small className='field-error'>Error retrieving categories!</small>}
            <FormField
              label='Category'
              htmlFor='categoryId'
              error={errors.categoryId?.message}
            >
              <select id='categoryId' {...register('categoryId')} disabled={!selectedType} className='input-standard'>
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
            </FormField>
          </>
        )}
      </fieldset>

      {selectedType === 'TRANSFER' && (
        <fieldset>
          {isLoadingAccounts && <small className='text-xs text-txt-muted'>Loading accounts...</small>}
          {error && <small className='field-error'>Error retrieving accounts!</small>}
          <FormField
            label='Destination Account'
            htmlFor='toAccountId'
            error={errors.toAccountId?.message}
          >
            <select id='toAccountId' {...register('toAccountId')} disabled={isLoadingAccounts || !!error} className='input-standard'>
              <option value=''>-- Select Destination Account --</option>
              {accountData?.filter(acc => acc.id !== sourceAccountId)
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
            </select>
          </FormField>

          <FormField
            label='Frequency'
            htmlFor='frequency'
            error={errors.frequency?.message}
          >
            <select id='frequency' {...register('frequency')} className='input-standard'>
              <option value=''>-- Select Frequency --</option>
              {FREQUENCIES?.map((freq) => (
                <option key={freq.label} value={freq.value}>{freq.label}</option>
              ))}
            </select>
          </FormField>
        </fieldset>
      )}


      <fieldset className='flex justify-between'>
        <FormField
          label='Start Date'
          htmlFor='startDate'
          error={errors.startDate?.message}
        >
          <Controller
            control={control}
            name='startDate'
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                id='startDate'
                onChange={onChange}
                onBlur={onBlur}
                selected={value}
                inputRef={ref}
                dateFormat='dd MMM yyyy'
                placeholderText='Select date'
                className='input-standard'
              />
            )}
          />
        </FormField>
        <FormField
          label='End Date'
          htmlFor='endDate'
          error={errors.endDate?.message}
        >
          <Controller
            control={control}
            name='endDate'
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                id='endDate'
                onChange={onChange}
                onBlur={onBlur}
                selected={value}
                inputRef={ref}
                dateFormat='dd MMM yyyy'
                placeholderText='Select end date'
                className='input-standard'
              />
            )}
          />
        </FormField>
      </fieldset>



      <div className='mt-6 flex justify-center'>
        <Button
          type='submit'
          isLoading={isUpdating || isLoadingAccounts || isLoadingCategories}
          loadingText='Updating...'
        >
          Update Template
        </Button>
      </div>

    </form>
  );
}

export default UpdateTemplateForm;
