import { Pie, PieChart, Tooltip } from 'recharts';
import { registrationColors } from '@/utils/data/investmentColors';

const CustomTooltip = ({ active, payload, nameKey }) => {
  if (!active || !payload || !payload.length) return null;

  // get hovered slice data & format
  const data = payload[0];
  const color = data.payload.color || data.fill;
  const name = data.payload[nameKey];
  const amount = `$${Number(data.value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const percent = `${data.payload.parentPercentage}`;

  return (
    <div className='min-w-45 rounded-xl border border-soft bg-canvas-card p-3.5 shadow-sm font-sans' role='status' aria-live='polite'>
      <div className='mb-1.5 flex items-center gap-2'>
        <span
          className='h-2.5 w-2.5 shrink-0 rounded-full'
          style={{ backgroundColor: color }}
        />
        <span className='text-small font-semibold'>
          {name}
        </span>
      </div>

      <div className='flex items-baseline justify-between gap-3'>
        <span className='text-body font-bold tracking-tight'>
          {amount}
        </span>
        <span className='text-small font-semibold text-txt-muted'>
          {percent}
        </span>
      </div>
    </div>
  );
};

function DashboardPieChart({ data, dataKey, nameKey, ariaLabel = 'Chart' }) {
  const formattedData = data?.map(item => ({
    ...item,
    fill: item.color || registrationColors[item.registration] || '#9ca3af',
  }));

  return (
    <PieChart width={300} height={300} aria-label={ariaLabel}>
      <Pie
        data={formattedData}
        dataKey={dataKey}
        cx='50%'
        cy='50%'
        outerRadius='80%'
        stroke='none'
      />
      <Tooltip content={<CustomTooltip
        nameKey={nameKey}
      />} />
    </PieChart>
  );
}

export default DashboardPieChart;
