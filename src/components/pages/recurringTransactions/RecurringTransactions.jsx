import { useRecurringTransaction, useDeleteRecurringTransaction, useUpdateRecurringTransactionPauseStatus } from '@/hooks/useRecurringTransaction';
import UpdateTemplateForm from '@/components/pages/recurringTransactions/UpdateTemplateForm';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import Modal from '@/components/shared/Modal';
import { useState } from 'react';
import Button from '@/components/shared/ui/buttons/Button';
import OptionsMenu from '@/components/shared/ui/OptionsMenu';
import TabButtons from '@/components/shared/ui/buttons/TabButtons';
import { LoadingSpinner } from '@/components/shared/ui/LoadingSpinner';
import EmptyState from '@/components/shared/ui/EmptyState';

function RecurringTransactions() {
  const { data, isLoading, error } = useRecurringTransaction();
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteRecurringTransaction();
  const { mutate: updatePauseStatus, isPending: isUpdatingStatus } = useUpdateRecurringTransactionPauseStatus();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isPauseConfirmationOpen, setIsPauseConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('activeList');

  const pausedList = data?.filter(tx => tx.isPaused);
  const activeList = data?.filter(tx => !tx.isPaused);
  const currentList = activeTab === 'activeList' ? activeList : pausedList;

  const tabs = [
    { id: 'activeList', label: 'Active' },
    { id: 'pausedList', label: 'Paused' },
  ];

  function handleModalClose() {
    setIsEditOpen(false);
    setIsPauseConfirmationOpen(false);
    setIsDeleteConfirmationOpen(false);
  }
  const handleMenuClose = () => setIsOptionsMenuOpen(false);

  const handleOptionsMenu = (transaction) => {
    if (isOptionsMenuOpen && selectedTemplate?.id === transaction.id) {
      setIsOptionsMenuOpen(false);
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(transaction);
      setIsOptionsMenuOpen(true);
    }
  };

  const handleDeleteModalConfirmation = () => deleteTemplate({ id: selectedTemplate.id }, { onSuccess: () => handleModalClose() });
  const handlePauseModalConfirmation = () => updatePauseStatus({ id: selectedTemplate.id, pauseStatus: selectedTemplate.isPaused }, { onSuccess: handleModalClose });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState>We couldn&apos;t load your recurring transactions. Please try again.</EmptyState>;

  return (
    <section>
      <div className='text-center flex flex-col items-center md:text-left md:items-start mb-6'>
        <h1>Recurring Transactions&nbsp;Overview</h1>
      </div>

      <div className='flex justify-center items-center md:justify-start'>
        <TabButtons
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2 items-start mt-6'>
        {FREQUENCIES.map((freq) => {
          const items = currentList.filter((tx) => tx.frequency === freq.value);

          return (
            <div key={freq.label} className='flex flex-col gap-3'>
              <div className='flex items-center justify-between gap-3 border-b border-soft pb-2'>
                <h2>{freq.label}</h2>
                <span className='text-small text-txt-muted'>{items.length}</span>
              </div>

              <div className='flex flex-col gap-3'>
                {items.map((tx) => (
                  <article key={tx.id} className='card-compact flex flex-col gap-3'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0 flex-1'>
                        <h3 className='pr-2'>{tx.memo}</h3>
                      </div>

                      <OptionsMenu
                        label={tx.memo}
                        isOpen={isOptionsMenuOpen && selectedTemplate?.id === tx.id}
                        onClose={handleMenuClose}
                        onTriggerClick={() => handleOptionsMenu(tx)}
                      >
                        <li className='mb-1 border-b'>
                          <button
                            className='cursor-pointer'
                            aria-label={`Edit ${tx.memo}`}
                            onClick={() => {
                              setSelectedTemplate(tx);
                              setIsEditOpen(true);
                            }}
                          >
                            Edit
                          </button>
                        </li>

                        <li className='mb-1 border-b'>
                          <button
                            className='cursor-pointer'
                            aria-label={`${tx.isPaused ? 'Resume' : 'Pause'} ${tx.memo}`}
                            onClick={() => {
                              setSelectedTemplate(tx);
                              setIsPauseConfirmationOpen(true);
                            }}
                          >
                            {tx.isPaused ? 'Resume' : 'Pause'}
                          </button>
                        </li>

                        <li className='mb-1 border-b'>
                          <button
                            className='cursor-pointer'
                            aria-label={`Delete ${tx.memo}`}
                            onClick={() => {
                              setSelectedTemplate(tx);
                              setIsDeleteConfirmationOpen(true);
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </OptionsMenu>
                    </div>

                    <div className='flex items-end justify-between gap-3'>
                      <div className='flex items-center gap-2 text-small'>
                        <span className='badge border-soft bg-black/3'>
                          {tx.type}
                        </span>
                      </div>

                      <p className='text-metric-sm font-bold'>
                        ${tx.amount.toFixed(2)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={handleModalClose}
        title='Edit Template'
        body={
          selectedTemplate && (
            <UpdateTemplateForm
              template={selectedTemplate}
              onClose={handleModalClose}
            />
          )
        }
      />

      <Modal
        isOpen={isPauseConfirmationOpen}
        onClose={handleModalClose}
        title={selectedTemplate?.isPaused ? 'Resume Template' : 'Pause Template'}
        body={
          selectedTemplate ? (
            <div className='space-y-3'>
              <p>
                {selectedTemplate.isPaused ? 'Resume' : 'Pause'}{' '}
                <strong>{selectedTemplate.memo}</strong>?
              </p>
              <p>
                {selectedTemplate.isPaused
                  ? 'New transactions will start generating again.'
                  : 'No new transactions will be created until you resume it.'}
              </p>
              <p>
                Existing transactions won’t be affected.
              </p>
            </div>
          ) : null
        }
        footer={
          selectedTemplate ? (
            <>
              <Button
                onClick={handleModalClose}
                disabled={isDeleting}
                intent='subtle'
              >
                Cancel
              </Button>
              <Button onClick={handlePauseModalConfirmation} disabled={isUpdatingStatus}>
                {selectedTemplate.isPaused ? 'Resume Template' : 'Pause Template'}
              </Button>
            </>
          ) : null
        }
      />

      <Modal
        isOpen={isDeleteConfirmationOpen}
        onClose={handleModalClose}
        title='Delete Template'
        body={
          selectedTemplate && (
            <div className='space-y-2'>
              <p>
                Delete <strong>{selectedTemplate.memo}</strong>?
              </p>
              <p>
                This can’t be undone.
              </p>
            </div>
          )
        }
        footer={
          selectedTemplate && (
            <>
              <Button onClick={handleModalClose} intent='subtle'>
                Cancel
              </Button>
              <Button onClick={handleDeleteModalConfirmation} disabled={isDeleting} intent='danger'>
                Delete Template
              </Button>
            </>
          )
        }
      />
    </section>
  );
}

export default RecurringTransactions;
