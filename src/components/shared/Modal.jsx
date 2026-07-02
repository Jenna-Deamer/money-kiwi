import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title = 'Notice', body, footer }) {
  const modalRef = useRef(null);

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
    <dialog ref={modalRef} onKeyDown={handleKeyDown} className='m-auto w-[calc(100vw-2rem)] sm:w-full max-w-lg rounded p-4'>
      <header className='flex justify-between items-center pb-2'>
        <h2>{title}</h2>
        <button
          onClick={onClose}
          aria-label='Close Modal'
          className='cursor-pointer'
        >
          <X />
        </button>
      </header>

      <section className='space-y-4'>
        {body}
      </section>

      {footer && (
         <footer className='mt-6 flex flex-wrap justify-end gap-2'>
           {footer}
         </footer>
       )}

    </dialog>
  );
}

export default Modal;
