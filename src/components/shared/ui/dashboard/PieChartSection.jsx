import DashboardPieChart from '../dashboard/PieChart';
import { registrationColors } from '@/utils/data/investmentColors';

function DashboardPieChartSection({
  title,
  data,
  dataKey,
  valueLabel,
  nameKey = 'name',
  sumKey = 'sum',
  percentageKey = 'parentPercentage',
  childrenKey = 'children',
}) {
  return (
    <div className='card'>
      <div className='border-b border-soft pb-3 mb-4'>
        <h2 className='text-h2 font-semibold text-txt-main'>{title}</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
        <div className='flex items-center justify-center h-70'>
          <DashboardPieChart
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
          />
        </div>

        <div className='h-full flex flex-col'>
          <h3 className='text-sm font-bold uppercase tracking-wider text-txt-muted mb-3 shrink-0'>
            {valueLabel}
          </h3>

          <div className='space-y-4 overflow-y-auto max-h-100 pr-3'>
            {[...(data || [])]
              .sort((a, b) => b[sumKey] - a[sumKey])
              .map((category, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between text-body font-bold text-txt-main gap-4'>
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <span
                        className='w-3 h-3 rounded-full inline-block shrink-0'
                        style={{ backgroundColor: category.fill || category.color || registrationColors[category.registration] || '#ccc' }}
                      />

                      <span className='truncate'>
                        {category[nameKey]}
                      </span>
                    </div>

                    <div className='flex items-center justify-end gap-3 shrink-0 text-right'>
                      {category[childrenKey]?.length > 0 && (
                        <span className='whitespace-nowrap'>
                          ${category[sumKey].toFixed(2)}
                        </span>
                      )}

                      <span className='text-small font-semibold text-txt-main min-w-16 text-right whitespace-nowrap'>
                        {category[percentageKey]}
                      </span>
                    </div>
                  </div>

                  {category[childrenKey]?.length > 0 && (
                    <div className='pl-5 space-y-1.5'>
                      {category[childrenKey].map((child, childIdx) => (
                        <div
                          key={childIdx}
                          className='flex items-center justify-between text-small text-txt-main gap-4'
                        >
                          <span className='text-txt-muted truncate'>
                            {child.name}
                          </span>

                          <div className='flex items-center justify-end gap-3 shrink-0 text-right'>
                            <span className='whitespace-nowrap'>
                              ${child.sum.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default DashboardPieChartSection;
