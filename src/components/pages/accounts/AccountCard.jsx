import AccountList from '@/components/pages/accounts/AccountList';
import { useCategorizedAccounts } from '@/hooks/useAccounts';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';

function AccountCard() {
  const { data, isLoading, error } = useCategorizedAccounts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error...</div>;
  if (data.isEmpty) return  <div className='card text-center max-w-md m-auto md:m-0'>
    <p>You don’t have any financial accounts&nbsp;yet.<br />Create your first account to start tracking transactions.</p>
    <LinkButton to='/account/form' className='mt-2'>Create Account</LinkButton>
  </div>;
  return (
    <>
      <AccountList title='Cash & Banking' accounts={data.banking} />
      <AccountList title='Investments' accounts={data.investments} />
      <AccountList title='Liabilities' accounts={data.debt} />
      <AccountList title='Archived' accounts={data.archived} />
    </>
  );
}

export default AccountCard;
