import AccountList from '@/components/pages/accounts/AccountList';
import { useCategorizedAccounts } from '@/hooks/useAccounts';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';
import EmptyState from '@/components/shared/ui/EmptyState';

function AccountCard() {
  const { data, isLoading, error } = useCategorizedAccounts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState>We couldn&apos;t load your accounts. Please try again.</EmptyState>;
  if (data.isEmpty) return (
    <EmptyState>
      <p className='text-txt-muted'>You don’t have any financial accounts&nbsp;yet.<br />Create your first account to start tracking transactions.</p>
      <LinkButton to='/accounts/form' className='mt-4'>Create Account</LinkButton>
    </EmptyState>
  );
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
