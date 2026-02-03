import { useEffect, useRef } from 'react';

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
        <dialog ref={modalRef} onKeyDown={handleKeyDown}>
            <header>
                <h2>{title}</h2>
                <button onClick={onClose}>X</button>
            </header>

            <section>
                {body}
            </section>

            {footer && <footer>
                {footer}
            </footer>}

        </dialog>
    );
}

export default Modal;