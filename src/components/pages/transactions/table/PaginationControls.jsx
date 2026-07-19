import Button from '@/components/shared/ui/buttons/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
function PaginationControls({ totalPages, page, setPage, placeholder }) {
  return (
    <div className='flex flex-wrap items-center'>
      <p className='mr-4'>
        Page: {page + 1} of {totalPages}
      </p>

      {totalPages > 1 && (
        <div className='flex gap-2'>
          <Button
            intent='subtle'
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            leftIcon={<ChevronLeft />}
            size='sm'
          >
            Previous
          </Button>

          <Button
            intent='subtle'
            onClick={() => {
              if (!placeholder && totalPages) {
                setPage((prev) => prev + 1);
              }
            }}
            disabled={placeholder || page >= totalPages - 1}
            rightIcon={<ChevronRight />}
            size='sm'
          >
            Next
          </Button>
        </div>

      )}
    </div>
  );
}

export default PaginationControls;
