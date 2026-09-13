import { useRecurringTransaction, useDeleteRecurringTransaction, useUpdateRecurringTransactionPauseStatus } from '@/hooks/useRecurringTransaction';
import UpdateTemplateForm from '@/components/pages/recurringTransactions/UpdateTemplateForm';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import Modal from '@/components/shared/Modal';
import { useState } from 'react';
import Button from '@/components/shared/ui/buttons/Button';
import OptionsMenu from '@/components/shared/ui/OptionsMenu';
import TabButtons from '@/components/shared/ui/buttons/TabButtons';

function RecurringTransactions() {
  const { data, isLoading, error } = useRecurringTransaction();
  const { mutate: deleteTemplate, isLoading: isDeleting } = useDeleteRecurringTransaction();
  const { mutate: updatePauseStatus, isLoading: isUpdatingStatus } = useUpdateRecurringTransactionPauseStatus();
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

  if (isLoading) return <div>Loading</div>;
  if (error) return <div className='form-error'>Error: {error}</div>;

  return (
    <section>
      <div className='text-center flex flex-col items-center md:text-left md:items-start mb-6'>
        <h1>Recurring Transactions&nbsp;Overview</h1>
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
                        isOpen={isOptionsMenuOpen && selectedTemplate?.id === tx.id}
                        onClose={handleMenuClose}
                        onTriggerClick={() => handleOptionsMenu(tx)}
                      >
                        <li className='mb-1 border-b'>
                          <button
                            className='cursor-pointer'
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
        title={'Edit ' + selectedTemplate?.memo + ' Template'}
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
                <strong>{selectedTemplate.memo}</strong> is currently{' '}
                {selectedTemplate.isPaused ? 'paused' : 'active'}.
              </p>

              {selectedTemplate.isPaused ? (
                <p>
                  Resuming this template will allow transactions to start generating again
                  based on the template’s current schedule and rules.
                </p>
              ) : (
                <p>
                  Pausing this template will stop new transactions from being generated
                  until the template is resumed.
                </p>
              )}

              <p>
                Existing transactions that have already been created will remain unchanged.
              </p>
            </div>
          ) : null
        }
        footer={
          selectedTemplate ? (
            <>
              <Button onClick={handlePauseModalConfirmation} disabled={isUpdatingStatus}>
                {selectedTemplate.isPaused ? 'Resume template' : 'Pause template'}
              </Button>
              <Button
                onClick={handleModalClose}
                disabled={isDeleting}
                intent='subtle'
              >
                Cancel
              </Button>
            </>
          ) : null
        }
      />

      <Modal
        isOpen={isDeleteConfirmationOpen}
        onClose={handleModalClose}
        title={'Confirm Deletion For ' + selectedTemplate?.memo + ' Template'}
        body={
          selectedTemplate && (
            <div className='space-y-2'>
              <p>
                Are you sure you want to delete the template: <strong>{selectedTemplate.memo}</strong>?
              </p>
            </div>
          )
        }
        footer={
          selectedTemplate && (
            <>
              <Button onClick={handleDeleteModalConfirmation} disabled={isDeleting} intent='danger'>
                Delete Template
              </Button>
              <Button onClick={handleModalClose} intent='subtle'>
                Cancel
              </Button>
            </>
          )
        }
      />
    </section>
  );
}

export default RecurringTransactions;
