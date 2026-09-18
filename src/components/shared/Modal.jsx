import { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title = 'Notice', body, footer }) {
  const modalRef = useRef(null);
  const titleId = useId();

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    // handle dialog built in escape to close
    if (e.key === 'Escape') {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    if (isOpen) { modalElement.showModal(); }
    else { modalElement.close(); }

  }, [isOpen]);

  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown} aria-labelledby={titleId} className='m-auto w-[calc(100vw-2rem)] sm:w-full max-w-lg rounded-xl p-6 shadow-lg'>
      <header className='flex justify-between items-center gap-4 pb-4'>
        <h2 id={titleId}>{title}</h2>
        <button
          onClick={onClose}
          aria-label='Close dialog'
          className='cursor-pointer rounded-md p-1 -m-1 text-txt-muted hover:text-txt-main focus-primary'
        >
          <X className='icon-lg' />
        </button>
      </header>

      <div className='space-y-4'>
        {body}
      </div>

      {footer && (
         <footer className='mt-6 flex flex-wrap justify-end gap-2'>
           {footer}
         </footer>
       )}

    </dialog>
  );
}

export default Modal;
