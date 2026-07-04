import { useRecurringTransaction, useDeleteRecurringTransaction, useUpdateRecurringTransactionPauseStatus } from '@/hooks/useRecurringTransaction';
import UpdateTemplateForm from '@/components/pages/recurringTransactions/UpdateTemplateForm';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import Modal from '@/components/shared/Modal';
import { useState } from 'react';
import Button from '@/components/shared/ui/buttons/Button';

function RecurringTransactions() {
  const { data, isLoading, error } = useRecurringTransaction();
  const { mutate: deleteTemplate, isLoading: isDeleting } = useDeleteRecurringTransaction();
  const { mutate: updatePauseStatus, isLoading: isUpdatingStatus } = useUpdateRecurringTransactionPauseStatus();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPauseConfirmationOpen, setIsPauseConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  function handleClose() {
    setIsEditOpen(false);
    setIsPauseConfirmationOpen(false);
    setIsDeleteConfirmationOpen(false);
    setSelectedTemplate(null);
  }

  const handleDeleteModalConfirmation = () => deleteTemplate({ id: selectedTemplate.id }, { onSuccess: handleClose });
  const handlePauseModalConfirmation = () => updatePauseStatus({ id: selectedTemplate.id, pauseStatus: selectedTemplate.isPaused }, { onSuccess: handleClose });

  if (isLoading) return <div>Loading</div>;
  if (error) return <div className='form-error'>Error: {error}</div>;
  return (
    <section>
      <h1 className='mb-6'>Recurring Transactions Overview</h1>
      <section className='grid md:grid-cols-2 md:gap-8 gap-4'>
        {FREQUENCIES?.map(freq => (
          <div key={freq.label}>
            <h3 className='border-b border-soft mb-4'>{freq.label}</h3>
            {data?.map(tx => (
              tx.frequency === freq.value &&
              <div key={tx.id} className='card p-4 mb-2 max-w-lg'>
                <h3>{tx.memo}</h3>
                <div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedTemplate(tx);
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTemplate(tx);
                        setIsPauseConfirmationOpen(true);
                      }}
                    >
                      Pause
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTemplate(tx);
                        setIsDeleteConfirmationOpen(true);
                      }}
                    >
                      Delete
                      </button>

                  </div>
                  <p>{tx.type} ${tx.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <Modal
        isOpen={isEditOpen}
        onClose={handleClose}
        title={'Edit ' + selectedTemplate?.memo + ' Template'}
        body={
          selectedTemplate && (
            <UpdateTemplateForm
              template={selectedTemplate}
              onClose={handleClose}
            />
            )
        }
      />
      <Modal
        isOpen={isPauseConfirmationOpen}
        onClose={handleClose}
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
                onClick={handleClose}
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
        onClose={handleClose}
        title={'Confirm Deletion For ' + selectedTemplate?.memo + ' Template'}
        body={
          selectedTemplate && (
            <div className='space-y-2'>
              <p>
                Delete <strong>{selectedTemplate.memo} Template</strong>?
              </p>
              <p>
                 This action cannot be undone. The template will be permanently deleted, and no
                 new transactions will be created going forward. Existing transactions will&nbsp;remain.
               </p>
            </div>
          )
        }
        footer={
          selectedTemplate ? (
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
                {isDeleting ? 'Deleting...' : 'Delete Template'}
              </Button>
            </>
          ) : null
        }
      />
    </section>
  );
}


export default RecurringTransactions;
