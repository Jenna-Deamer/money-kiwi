import AccountCard from '@/components/pages/accounts/AccountCard';
import LinkButton from '@/components/shared/ui/buttons/LinkButton';

function AcccountMangement() {
  return (
    <section>
      <div className='flex items-center justify-between mb-6' >
        <h1>Your Accounts</h1>
        <LinkButton link='/accounts/form' intent='primary'>Add Account</LinkButton>
      </div>

      <AccountCard />
    </section>
  );
}

export default AcccountMangement;
