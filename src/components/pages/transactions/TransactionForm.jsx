import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '@/utils/validation/transactionSchema';
import { useCreateTransaction, useGetTransaction, useUpdateTransaction } from '@/hooks/useTransaction';
import { useChildrenCategories } from '@/hooks/useCategory';
import { useAccounts } from '@/hooks/useAccounts';
import DatePicker from 'react-datepicker';
import { CustomHeader } from '@/components/shared/ui/form/DatePickerField';
import { formatDateToIso } from '@/utils/dateHelper';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import { VALID_TYPES } from '@/utils/data/transactionTypes';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';


function TransactionForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preSelectedAccount = searchParams.get('accountId');
  const { data, isLoading, error } = useAccounts();

  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { mutate: createTransaction, isLoading: isCreating } = useCreateTransaction();
  const { mutate: updateTransaction, isLoading: isUpdating } = useUpdateTransaction();
  const { data: existingTransaction, isLoading: isFetching } = useGetTransaction(id);

  const { register, handleSubmit, watch, reset, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      accountId: preSelectedAccount || '',
      memo: '',
      type: '',
      amount: '',
      date: new Date(),
      categoryId: '',
      status: 'POSTED',
      toAccountId: '',
      isRecurring: false,
      frequency: '',
      endDate: null,
    }
  });

  const selectedType = watch('type');
  const sourceAccountId = watch('accountId');
  const isRecurring = watch('isRecurring');

  const { data: { childrenCategories } = {}, isLoading: isLoadingCategories, error: categoryError } = useChildrenCategories(selectedType);

  useEffect(() => {
    if (isEditMode && existingTransaction) {
      const normalized = { ...existingTransaction };

      if (normalized.date && typeof normalized.date === 'string') {
        const [year, month, day] = normalized.date.split('T')[0].split('-').map(Number);
        normalized.date = new Date(year, month - 1, day);
      }

      reset(normalized);
    }
  }, [isEditMode, existingTransaction, reset]);

  useEffect(() => {
    if (selectedType !== 'TRANSFER') {
      setValue('toAccountId', '');
    }
  }, [selectedType, setValue]);

  const onSubmit = async (formData) => {
    setServerError('');

    const formattedDate = formData.date instanceof Date
      ? formatDateToIso(formData.date)
      : formData.date;

    const payload = isEditMode
      ? { ...formData, date: formattedDate, id }
      : { ...formData, date: formattedDate };

    const mutation = isEditMode ? updateTransaction : createTransaction;

    mutation(payload, {
      onSuccess: () => navigate('/transactions'),
      onError: (error) => setServerError(error.message)
    });
  };

  if (isEditMode && isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <section className='flex flex-col items-center justify-center h-full'>
      <div className='card w-full max-w-sm'>

        <h1 className='mb-2 text-center'>{isEditMode ? 'Update Transaction' : 'Create Transaction'}</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className='form-error'>
              <p>{serverError}</p>
            </div>
          )}

          <fieldset>
            {isLoading && <small className='text-xs text-txt-muted'>Loading...</small>}
            {error && <small className='field-error'>Error retrieving accounts!</small>}

            <FormField
              label='Account'
              htmlFor='accountId'
              error={errors.accountId?.message}
            >
              <select id='accountId' {...register('accountId')} disabled={isLoading || !!error} className='input-standard'>
                <option value=''>-- Select Source Account --</option>
                {data?.map((account) => (
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
              <input id='memo' {...register('memo')} placeholder='Hydro Bill' className='input-standard' />
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

            <FormField
              label='Category'
              htmlFor='categoryId'
              error={errors.categoryId?.message}
            >
              <>
                {isLoadingCategories && <small className='text-xs text-txt-muted'>Loading categories...</small>}
                {categoryError && <small className='field-error'>Error retrieving categories!</small>}
              </>
              <select id='categoryId' {...register('categoryId')} disabled={!selectedType} className='input-standard'>
                {!selectedType ? (
                  <option value=''>-- Select Type First --</option>
                ) : (
                  <>
                    <option value=''>{selectedType === 'TRANSFER' ? '-- Optional --' : '-- Select Category --'}</option>
                    {childrenCategories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </FormField>
          </fieldset>

          {selectedType === 'TRANSFER' && (
            <fieldset>
              <>
                {isLoading && <small className='text-xs text-txt-muted'>Loading accounts...</small>}
                {error && <small className='field-error'>Error retrieving accounts!</small>}
              </>
              <FormField
                label='Destination Account'
                htmlFor='toAccountId'
                error={errors.toAccountId?.message}
              >
                <select id='toAccountId' {...register('toAccountId')} disabled={isLoading || !!error} className='input-standard'>
                  <option value=''>-- Select Destination Account --</option>
                  {data?.filter(acc => acc.id !== sourceAccountId)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                </select>
              </FormField>
            </fieldset>
          )}

          <fieldset>
            <FormField
              label='Date'
              htmlFor='date'
              error={errors.date?.message}
            >
              <Controller
                control={control}
                name='date'
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <DatePicker
                    id='date'
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    inputRef={ref}
                    dateFormat='dd MMM yyyy'
                    placeholderText='Select date'
                    className='input-standard'
                    renderCustomHeader={(props) => <CustomHeader {...props} />}
                  />
                )}
              />
            </FormField>
          </fieldset>

          <fieldset className='flex gap-2 items-center'>
            <label htmlFor='isRecurring'>Recurring Transaction</label>
            <input {...register('isRecurring')}
              type='checkbox'
              id='isRecurring'
            >          </input>
          </fieldset>

          {isRecurring && (

            <fieldset>
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
                      placeholderText='Optional - Select end date'
                      className='input-standard'
                      renderCustomHeader={(props) => <CustomHeader {...props} />}
                    />
                  )}
                />
              </FormField>
            </fieldset>


          )}
          <div className='mt-6 flex justify-center'>
            <Button type='submit'
              disabled={isCreating || isUpdating || isFetching}
              intent='primary'
              loadingText={isEditMode ? 'Updating Transaction...' : 'Creating Transaction...'}
              isLoading={isUpdating || isCreating || isFetching}
            >
              {isEditMode ? 'Update Transaction' : 'Create Transaction'}
            </Button>
          </div>

        </form>
      </div>
    </section>
  );
}

export default TransactionForm;
