import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { formatSubCategory } from '@/utils/data/accountLabelHelper';
import Button from '@/components/shared/ui/buttons/Button';
import { useUpdateAccountStatus, useDeleteAccount } from '@/hooks/useAccounts';
import OptionsMenu from '@/components/shared/ui/OptionsMenu';

function AccountList({ title, accounts }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState(false);
  const { mutate: updateStatus, isLoading: isUpdating } = useUpdateAccountStatus();
  const { mutate: deleteAccount, isLoading: isDeleting } = useDeleteAccount();

  const navigate = useNavigate();

  const handleClose = () => {
    setSelectedAccount(null);
    setIsAccountOptionsOpen(false);
    setIsStatusOpen(false);
    setIsDeleteOpen(false);
  };

  const handleAccountOptionsMenu = (account) => {
    if (isAccountOptionsOpen && selectedAccount?.id === account.id) {
      setIsAccountOptionsOpen(false);
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
      setIsAccountOptionsOpen(true);
    }
  };

  const handleStatusModalConfrimation = () => {
    const newStatus = selectedAccount.status === 'active' ? 'archived' : 'active';

    updateStatus(
      { id: selectedAccount.id, status: newStatus },
      { onSuccess: handleClose }
    );
  };

  const handleDeleteModalConfirmation = () => {
    deleteAccount(
      { id: selectedAccount.id },
      { onSuccess: handleClose }
    );
  };

  if (accounts.length === 0) return null;

  return (
    <section className='mb-4'>
      <h2 className='border-b border-soft mb-4'>{title}</h2>

      {accounts.map((account) => (
        <div key={account.id} className='card p-4 mb-2 max-w-lg'>
          <div>
            <div className='flex justify-between'>
              <h3 className='pb-1.5'>
                {account.institution} - {account.name}
              </h3>


              <OptionsMenu
                isOpen={isAccountOptionsOpen && selectedAccount?.id === account.id}
                onClose={handleClose}
                onTriggerClick={() => handleAccountOptionsMenu(account)}
              >
                <li className='mb-1 border-b'>
                  <Link to={`/accounts/form/${account.id}`} className='cursor-pointer'>
                    Edit
                  </Link>
                </li>

                <li className='mb-1 border-b'>
                  <button
                    className='cursor-pointer'
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
            <span className='badge border-black/10 bg-black/3'>
              {formatSubCategory(account.subCategory)}
            </span>
            {account.registration !== 'N/A' ? (
              <span className='badge border-black/10 bg-black/3'>
                {account.registration}
              </span>
            ) : null}
          </div>

          <p className='flex justify-end font-bold'>${account.balance.toFixed(2)}</p>
        </div>
  ))
}

      <Modal
        isOpen={isStatusOpen}
        onClose={handleClose}
        title={selectedAccount?.status === 'active' ? 'Archive account' : 'Restore account'}
        body={
          selectedAccount && (
            <>
              {selectedAccount.status === 'active' && (
                <>
                  {selectedAccount.balance > 0.01 ? (
                    <div className='space-y-1'>
                      <p>
                        <strong>{selectedAccount.name}</strong> can’t be archived&nbsp;yet.
                      </p>
                      <p>
                        This account still has a balance. Transfer or remove the remaining funds before archiving&nbsp;it.
                      </p>
                      <p>
                        Current balance: <strong>${selectedAccount.balance.toFixed(2)}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <p>
                        Archive <strong>{selectedAccount.name}</strong>?
                      </p>
                      <p>
                        This account will move to the Archive tab. Existing transactions will remain, but you won’t be able to use this account for new&nbsp;records.
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
                    This account will move back to your active accounts and can be used for new records&nbsp;again.
                  </p>
                </div>
              )}
            </>
          )
        }
        footer={
          selectedAccount ? (
            <>
              {selectedAccount.status === 'active' && selectedAccount.balance > 0.01 ? (
                <>
                  <Button
                    onClick={handleClose}
                    disabled={isUpdating}
                    intent='subtle'
                  >
                    Cancel
                  </Button>

                  <Button onClick={() => navigate('/transactions')}>
                    Transfer funds
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleClose}
                    disabled={isUpdating}
                    intent='subtle'
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleStatusModalConfrimation}
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? selectedAccount.status === 'active'
                        ? 'Archiving...'
                        : 'Restoring...'
                      : selectedAccount.status === 'active'
                        ? 'Archive account'
                        : 'Restore account'}
                  </Button>
                </>
              )}
            </>
          ) : null
        }
      />
      <Modal
        isOpen={isDeleteOpen}
        onClose={handleClose}
        title='Delete Account'
        body={
          selectedAccount && (
            <div className='space-y-2'>
              <p>
                Delete <strong>{selectedAccount.name}</strong>?
              </p>
              <p>
                This action can’t be undone. The account and its data will be <b>permanently removed.</b>
              </p>
            </div>
          )
        }
        footer={
          selectedAccount ? (
            <>
              <Button
                onClick={handleClose}
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
                {isDeleting ? 'Deleting...' : 'Delete account'}
              </Button>
            </>
          ) : null
        }
      />
    </section >
  );
}

export default AccountList;
