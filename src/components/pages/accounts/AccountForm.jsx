import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/utils/validation/finAccountSchema';
import { useCreateAccount, useGetAccount, useUpdateAccount } from '@/hooks/useAccounts';
import Button from '@/components/shared/ui/buttons/Button';
import FormField from '@/components/shared/ui/form/FormField';

const validSubCategories = {
  banking: ['cash', 'chequing', 'high_interest_savings', 'savings'],
  investments: ['brokerage', 'crypto', 'gic', 'mutual_fund', 'pension', 'robo_advisor'],
  credit: ['auto_loan', 'credit_card', 'line_of_credit', 'mortgage', 'personal_loan', 'student_loan']
};

function AccountForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { mutate: createAccount, isLoading: isCreating } = useCreateAccount();
  const { mutate: updateAccount, isLoading: isUpdating } = useUpdateAccount();
  const { data: existingAccount, isLoading: isFetching } = useGetAccount(id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      institution: '',
      category: '',
      subCategory: '',
      registration: ''
    }
  });

  const selectedCategory = watch('category');
  const selectedSubCategory = watch('subCategory');

  useEffect(() => {
    if (isEditMode && existingAccount) {
      reset(existingAccount);
    }
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
    <section className='flex flex-col items-center justify-center h-full'>
      <div className='card w-full max-w-sm'>
        <h1 className='text-center my-4'>
          {isEditMode ? 'Update Account' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className='form-error'>
              <p>{serverError}</p>
            </div>
          )}

          <fieldset>
            <FormField
              label='Account Name'
              htmlFor='account name'
              error={errors.name?.message}
            >
              <input
                {...register('name')}
                placeholder='Chequings'
                className='input-standard'
              />
            </FormField>

            <FormField
              label='Insitution'
              htmlFor='institution'
              error={errors.institution?.message}
            >
              <input
                {...register('institution')}
                placeholder='Scotia Bank'
                className='input-standard'
              />
            </FormField>
          </fieldset>

          <fieldset>
            <FormField
              label='Category'
              htmlFor='category'
              error={errors.category?.message}
            >
              <select
                className='input-standard'
                {...register('category', {
                  onChange: (e) => {
                    const val = e.target.value;

                    setValue('category', val);
                    setValue('subCategory', '');
                    setValue('registration', '');
                  }
                })}
                disabled={isCreating || isUpdating || isFetching}
              >
                <option value=''>-- Select Purpose --</option>
                <option value='banking'>Banking</option>
                <option value='investments'>Investments</option>
                <option value='credit'>Credit & Loans</option>
              </select>
            </FormField>

            <FormField
              label='Subcategory'
              htmlFor='subcategory'
              error={errors.subCategory?.message}
            >
              <select
                className='input-standard'
                {...register('subCategory', {
                  onChange: (e) => {
                    const val = e.target.value;

                    setValue('subCategory', val);
                    setValue('registration', '');
                  }
                })}
                disabled={isCreating || isUpdating || isFetching || !selectedCategory}
              >
                {!selectedCategory ? (
                  <option value=''>-- Select Category First --</option>
                ) : (
                  <>
                    <option value=''>-- Select Subcategory --</option>
                    {validSubCategories[selectedCategory].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </FormField>
          </fieldset>

          <fieldset>
            <FormField
              label='Registration'
              htmlFor='registration'
              error={errors.registration?.message}
            >
              <select
                {...register('registration')}
                className='input-standard'
                disabled={isCreating || isUpdating || isFetching || !selectedCategory || !selectedSubCategory}
              >
                {!selectedCategory ? (
                  <option value=''>-- Select Category First --</option>
                ) : !selectedSubCategory ? (
                  <option value=''>-- Select Subcategory First --</option>
                ) : selectedCategory === 'credit' ? (
                  <option value='N/A'>N/A (Not applicable for debt)</option>
                ) : (
                  <>
                    <option value=''>-- Select Registration --</option>
                    <option value='Non-registered'>Non-registered</option>
                    <option value='TFSA'>TFSA</option>
                    <option value='RRSP'>RRSP</option>
                    <option value='FHSA'>FHSA</option>
                  </>
                )}
              </select>
            </FormField>
          </fieldset>

          <div className='text-center mt-2'>
            <Button
              type='submit'
              disabled={isCreating || isUpdating || isFetching}
              intent='primary'
              loadingText={isEditMode ? 'Updating Account...' : 'Creating Account...'}
              isLoading={isUpdating || isCreating || isFetching}
            >
              {isEditMode ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AccountForm;
