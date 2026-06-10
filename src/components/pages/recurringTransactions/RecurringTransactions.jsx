import { useRecurringTransaction, useDeleteRecurringTransaction } from '@/context/useRecurringTransaction';
import UpdateTemplateForm from '@/components/pages/recurringTransactions/UpdateTemplateForm';
import { FREQUENCIES } from '@/utils/data/recurringFrequencies';
import Modal from '@/components/shared/Modal';
import { useState } from 'react';

function RecurringTransactions() {
  const { data, isLoading, error } = useRecurringTransaction();
  const { mutate: deleteTemplate, isLoading: isDeleting } = useDeleteRecurringTransaction();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPauseConfirmationOpen, setIsPauseConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error: {error}</div>

  function handleClose() {
    setIsEditOpen(false);
    setIsPauseConfirmationOpen(false);
    setIsDeleteConfirmationOpen(false);
    setSelectedTemplate(null);
  }

  const handleDeleteModalConfirmation = () => deleteTemplate({ id: selectedTemplate.id }, { onSuccess: handleClose });

  return (
    <>
      <h1>Recurring Transactions Overview</h1>
      <div>
      </div>
      <section>
        {FREQUENCIES?.map(freq => (
          <div key={freq.label}>
            <h3>{freq.label}</h3>
            {data?.map(tx => (
              tx.frequency === freq.value &&
              <div key={tx.id}>
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
        title={'Edit ' + selectedTemplate?.memo + ' Active Status'}

        body={
          <>

          </>
        }
      />
      <Modal
        isOpen={isDeleteConfirmationOpen}
        onClose={handleClose}
        title={'Confirm Deletion For ' + selectedTemplate?.memo + ' Template'}
        body={
          <div>
            <h3>Are you sure you want to delete {selectedTemplate?.memo}?</h3>
            <p>
              Warning: This cannot be undone. The template will be <b>permanently removed</b>,
              and no new transactions will be created on its schedule. All transactions
              that already exist up to today will&nbsp;remain.
            </p>
            <button onClick={handleDeleteModalConfirmation} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
            </button>
            <button onClick={handleClose} disabled={isDeleting}>Cancel</button>
          </div>
        }
      />
    </>
  )
}


export default RecurringTransactions;
