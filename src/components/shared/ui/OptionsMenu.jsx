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
  }, [isOpen, menuRef, onClose])

  return (
    <div ref={menuRef} className='flex gap-2.5' >
      <div className='relative'>
        <button
          className='cursor-pointer'
          onClick={() => onTriggerClick()}
          aria-label='Open Options Menu'
        >
          <EllipsisVertical />
        </button>
        <ul
          className={`${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
                absolute top-6 right-2 bg-gray-200 z-1 border border-gray-500
                py-1 px-2 transition-all duration-300 rounded`}
        >
          {children}
        </ul>
      </div>
    </div>
  )
}


export default OptionsMenu;
