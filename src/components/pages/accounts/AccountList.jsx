import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { formatSubCategory } from '@/utils/data/accountLabelHelper';
import { EllipsisVertical } from 'lucide-react';

import { useUpdateAccountStatus, useDeleteAccount } from '@/hooks/useAccounts';

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
    if (isAccountOptionsOpen && selectedAccount.id === account.id) {
      setIsAccountOptionsOpen(false);
      setSelectedAccount(null);
    }else{
      setSelectedAccount(account)
      setIsAccountOptionsOpen(true)
    }
  };

  const handleStatusModalConfrimation = () => {
    const newStatus = selectedAccount.status === 'active' ? 'archived' : 'active';

    updateStatus({ id: selectedAccount.id, status: newStatus },
      { onSuccess: handleClose }
    );
  };

  const handleDeleteModalConfirmation = () => {
    deleteAccount({ id: selectedAccount.id },
      { onSuccess: handleClose }
    );
  };

  if (accounts.length === 0) return null;
  return (
    <section className='mb-4'>
      <h2 className='border-b border-soft mb-4'>{title}</h2>
      {accounts.map((account) => (
        <div key={account.id} className='card p-4 mb-2'>
          <div>
            <div className='flex justify-between'>
              <h3>{account.name}</h3>
              <div className='flex gap-2.5'>
                <p>${account.balance.toFixed(2)}</p>

                <div className='relative'>
                  <button className='cursor-pointer' onClick={() => handleAccountOptionsMenu(account)}><EllipsisVertical /></button>
                  <ul className={`${isAccountOptionsOpen && account.id === selectedAccount?.id ? 'visible opacity-100' : 'invisible  opacity-0'}
                    absolute
                    top-6
                    right-2
                    bg-gray-200
                    z-1
                    border
                    border-gray-500
                    py-1
                    px-2
                    transition-all
                    duration-300
                    `}>
                    <li className='mb-1 border-b'><Link to={`/accounts/form/${account.id}`} className='cursor-pointer'>Edit</Link></li>
                    <li className='mb-1 border-b'>
                      <button className='cursor-pointer' onClick={() => {
                        setIsStatusOpen(true);
                        setSelectedAccount(account);
                      }}>{account.status === 'active' ? 'Archive' : 'Unarchive'}</button>
                    </li>
                    <li className='mb-1 border-b'>
                      <button className='cursor-pointer' onClick={() => {
                        setIsDeleteOpen(true);
                        setSelectedAccount(account);
                      }}>Delete</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='flex gap-1'>
              <span>{formatSubCategory(account.subCategory)}</span>
              {account.registration !== 'N/A' ? (
                <span>{account.registration}</span>
              ) : null}
            </div>
            <small className='flex justify-end'>{account.institution}</small>
          </div>
        </div>
      ))}

      <Modal
        isOpen={isStatusOpen}
        onClose={handleClose}
        title='Confirm Status Change'
        body={
          selectedAccount && (
            <>
              {selectedAccount.status === 'active' && (
                <div>
                  <h3>Archive {selectedAccount.name}?</h3>
                  <p>Your transactions will remain but the account will be hidden.</p>

                  {selectedAccount.balance > 0.01 ? (
                    <div>
                      <p><strong>Cannot Archive:</strong> Balance must be zero.</p>
                      <p>Current balance: ${selectedAccount.balance.toFixed(2)}</p>
                      <button onClick={() => navigate('/transfers/new')}>
                        Go to Transfers
                      </button>
                    </div>
                  ) : (
                    <p>Ready to archive.</p>
                  )}

                  <div>
                    <button
                      onClick={handleStatusModalConfrimation}
                      disabled={isUpdating || selectedAccount.balance > 0.01}
                    >
                      {isUpdating ? 'Saving...' : 'Confirm Archive'}
                    </button>
                    <button onClick={handleClose} disabled={isUpdating}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {selectedAccount.status === 'archived' && (
                <div>
                  <h3>Are you sure you want to unarchive {selectedAccount.name}?</h3>
                  <p>The account will be moved back into your active lists.</p>
                  <button onClick={handleStatusModalConfrimation} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Confirm Unarchive'}
                  </button>
                  <button onClick={handleClose} disabled={isUpdating}>Cancel</button>
                </div>
              )}
            </>
          )}
      />

      <Modal
        isOpen={isDeleteOpen}
        onClose={handleClose}
        title='Confirm Deletion'
        body={
          selectedAccount && (
            <div>
              <h3>Are you sure you want to delete {selectedAccount.name}?</h3>
              <p>Warning: This cannot be undone. All data will be lost.</p>
              <button onClick={handleDeleteModalConfirmation} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
              <button onClick={handleClose} disabled={isDeleting}>Cancel</button>
            </div>
          )
        }
      />
    </section >
  );
}

export default AccountList;
