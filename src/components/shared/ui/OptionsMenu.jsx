import { useRef, useEffect } from 'react';
import { EllipsisVertical } from 'lucide-react';

function OptionsMenu({ isOpen, onClose, children, onTriggerClick }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideAccountMenuClick = (e) => { if (!menuRef.current?.contains(e.target)) onClose(); };

    if (!isOpen) return;
    window.addEventListener('mousedown', handleOutsideAccountMenuClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideAccountMenuClick);
    };
  }, [isOpen, menuRef, onClose]);

  return (
    <div ref={menuRef} className='flex gap-2.5' >
      <div className='relative'>
        <button
          className='cursor-pointer rounded-md p-1 -m-1 focus-primary'
          onClick={() => onTriggerClick()}
          aria-label='Open Options Menu'
        >
          <EllipsisVertical className='icon-md' />
        </button>
        <ul
          className={`${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
                absolute top-6 right-2 bg-canvas-card z-1 border border-soft shadow-sm
                py-1 transition-all duration-300 rounded-lg overflow-hidden
                [&>li:last-child]:border-b-0
                [&_a]:block [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:hover:bg-surface-muted
                [&_button]:block [&_button]:w-full [&_button]:text-left [&_button]:rounded-md [&_button]:px-2 [&_button]:py-1 [&_button]:hover:bg-surface-muted`}
        >
          {children}
        </ul>
      </div>
    </div>
  );
}


export default OptionsMenu;
