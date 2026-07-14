import { LoaderCircle } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div role='status' className='flex justify-center items-center'>
      <LoaderCircle className='animate-spin text-kiwi-dark' size={38} />
      <span class='sr-only'>Loading...</span>
    </div >);
};
