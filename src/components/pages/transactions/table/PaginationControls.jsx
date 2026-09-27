import Button from '@/components/shared/ui/buttons/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
function PaginationControls({ totalPages, page, setPage, placeholder }) {
  const isFirstPage = page === 0;
  const isLastPage = !!totalPages && page >= totalPages - 1;
  // While new page data is loading we keep the control focusable (aria-disabled)
  // instead of using native `disabled`, which would drop keyboard focus.
  const nextBlocked = placeholder || isLastPage;

  return (
    <div className='flex flex-wrap items-center'>
      <p className='mr-4 text-small text-txt-muted' role='status' aria-live='polite'>
        Page: {page + 1} of {totalPages}
      </p>

      {totalPages > 1 && (
        <div className='flex gap-2'>
          <Button
            intent='subtle'
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={isFirstPage}
            leftIcon={<ChevronLeft className='icon-sm' />}
            size='sm'
          >
            Previous
          </Button>

          <Button
            intent='subtle'
            onClick={() => {
              if (!nextBlocked) {
                setPage((prev) => prev + 1);
              }
            }}
            disabled={isLastPage}
            aria-disabled={nextBlocked || undefined}
            rightIcon={<ChevronRight className='icon-sm' />}
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
