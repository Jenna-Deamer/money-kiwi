import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { formatSubCategory } from '@/utils/accountLabelHelper';
import Button from '@/components/shared/ui/buttons/Button';
import { useUpdateAccountStatus, useDeleteAccount } from '@/hooks/useAccounts';
import OptionsMenu from '@/components/shared/ui/OptionsMenu';

function AccountList({ title, accounts }) {
  const isLiability = title === 'Liabilities';
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState(false);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAccountStatus();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const navigate = useNavigate();

  const handleModalClose = () => {
    setIsStatusOpen(false);
    setIsDeleteOpen(false);
    setSelectedAccount(null);

  };

  const handleMenuClose = () => setIsAccountOptionsOpen(false);

  const handleAccountOptionsMenu = (account) => {
    if (isAccountOptionsOpen && selectedAccount?.id === account.id) {
      setIsAccountOptionsOpen(false);
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
      setIsAccountOptionsOpen(true);
    }
  };

  const handleStatusModalConfirmation = () => {
    const newStatus = selectedAccount.status === 'active' ? 'archived' : 'active';

    updateStatus(
      { id: selectedAccount.id, status: newStatus },
      { onSuccess: handleModalClose }
    );
  };

  const handleDeleteModalConfirmation = () => {
    deleteAccount(
      { id: selectedAccount.id },
      { onSuccess: handleModalClose }
    );
  };

  if (accounts.length === 0) return null;

  return (
    <section className='mb-4'>
      <h2 className='border-b border-soft mb-4'>{title}</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {accounts.map((account) => (
          <div key={account.id} className='card-compact mb-2'>
            <div>
              <div className='flex justify-between'>
                <h3 className='pb-1.5'>
                  {account.institution} - {account.name}
                </h3>


                <OptionsMenu
                  label={`${account.institution} ${account.name}`.trim()}
                  isOpen={isAccountOptionsOpen && selectedAccount?.id === account.id}
                  onClose={handleMenuClose}
                  onTriggerClick={() => handleAccountOptionsMenu(account)}
                >
                  <li className='mb-1 border-b'>
                    <Link to={`/accounts/form/${account.id}`} className='cursor-pointer' aria-label={`Edit ${account.name}`}>
                      Edit
                    </Link>
                  </li>

                  <li className='mb-1 border-b'>
                    <button
                      className='cursor-pointer'
                      aria-label={`${account.status === 'active' ? 'Archive' : 'Unarchive'} ${account.name}`}
                      onClick={() => {
                        setIsStatusOpen(true);
                        setSelectedAccount(account);
                      }}
                    >
                      {account.status === 'active' ? 'Archive' : 'Unarchive'}
                    </button>
                  </li>

                  <li className='mb-1 border-b'>
                    <button
                      className='cursor-pointer'
                      aria-label={`Delete ${account.name}`}
                      onClick={() => {
                        setIsDeleteOpen(true);
                        setSelectedAccount(account);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                </OptionsMenu>



              </div>
            </div>

            <div className='flex gap-1'>
              <span className='badge border-soft bg-black/3'>
                {formatSubCategory(account.subCategory)}
              </span>
              {account.registration !== 'N/A' ? (
                <span className='badge border-soft bg-black/3'>
                  {account.registration}
                </span>
              ) : null}
            </div>

            <p className={`flex justify-end font-bold${isLiability && account.currentBalance < 0 ? ' text-expense' : ''}`}>${account.currentBalance.toFixed(2)}</p>
          </div>
        ))
        }
      </div>

      <Modal
        isOpen={isStatusOpen}
        onClose={handleModalClose}
        title={selectedAccount?.status === 'active' ? 'Archive Account' : 'Restore Account'}
        body={
          selectedAccount && (
            <>
              {selectedAccount.status === 'active' && (
                <>
                  {selectedAccount.currentBalance > 0.01 ? (
                    <div className='space-y-1'>
                      <p>
                        <strong>{selectedAccount.name}</strong> still has a balance of <strong>${selectedAccount.currentBalance.toFixed(2)}</strong>.
                      </p>
                      <p>
                        Transfer or remove the remaining funds before archiving&nbsp;it.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <p>
                        Archive <strong>{selectedAccount.name}</strong>?
                      </p>
                      <p>
                        It’ll move to the Archived section. Existing transactions stay, but you won’t be able to add new&nbsp;ones.
                      </p>
                    </div>
                  )}
                </>
              )}

              {selectedAccount.status === 'archived' && (
                <div className='space-y-2'>
                  <p>
                    Restore <strong>{selectedAccount.name}</strong>?
                  </p>
                  <p>
                    It’ll move back to your active accounts and can be used for new&nbsp;records again.
                  </p>
                </div>
              )}
            </>
          )
        }
        footer={
          selectedAccount ? (
            <>
              {selectedAccount.status === 'active' && selectedAccount.currentBalance > 0.01 ? (
                <>
                  <Button
                    onClick={handleModalClose}
                    disabled={isUpdating}
                    intent='subtle'
                  >
                    Cancel
                  </Button>

                  <Button onClick={() => navigate('/transactions')}>
                    Manage Transactions
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleModalClose}
                    disabled={isUpdating}
                    intent='subtle'
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleStatusModalConfirmation}
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? selectedAccount.status === 'active'
                        ? 'Archiving...'
                        : 'Restoring...'
                      : selectedAccount.status === 'active'
                        ? 'Archive Account'
                        : 'Restore Account'}
                  </Button>
                </>
              )}
            </>
          ) : null
        }
      />
      <Modal
        isOpen={isDeleteOpen}
        onClose={handleModalClose}
        title='Delete Account'
        body={
          selectedAccount && (
            <>
              {selectedAccount.currentBalance > 0.01 ? (
                <div className='space-y-1'>
                  <p>
                    <strong>{selectedAccount.name}</strong> still has a balance of <strong>${selectedAccount.currentBalance.toFixed(2)}</strong>.
                  </p>
                  <p>
                    Transfer or remove the remaining funds before deleting&nbsp;it.
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  <p>
                    Delete <strong>{selectedAccount.name}</strong>?
                  </p>
                  <p>
                    This can’t be undone. The account and all its data will be permanently&nbsp;deleted.
                  </p>
                </div>
              )}
            </>
          )
        }
        footer={
          selectedAccount ? (
            <>
              {selectedAccount.currentBalance > 0.01 ? (
                <>
                  <Button
                    onClick={handleModalClose}
                    disabled={isDeleting}
                    intent='subtle'
                  >
                    Cancel
                  </Button>

                  <Button onClick={() => navigate('/transactions')}>
                    Manage Transactions
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleModalClose}
                    disabled={isDeleting}
                    intent='subtle'
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleDeleteModalConfirmation}
                    disabled={isDeleting}
                    intent='danger'
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </>
              )}
            </>
          ) : null
        }
      />
    </section >
  );
}

export default AccountList;
