import { Pie, PieChart, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  // get hovered slice data & format
  const data = payload[0];
  const color = data.payload.color || data.fill;
  const name = data.name;
  const amount = `$${Number(data.value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const percent = `${data.payload.parentPercentage}`;

  return (
    <div className='min-w-45 rounded-xl border border-soft bg-canvas-card p-3.5 shadow-sm font-sans'>
      <div className='mb-1.5 flex items-center gap-2'>
        <span
          className='h-2.5 w-2.5 shrink-0 rounded-full'
          style={{ backgroundColor: color }}
        />
        <span className='text-small font-semibold text-txt-main'>
          {name}
        </span>
      </div>

      <div className='flex items-baseline justify-between gap-3'>
        <span className='text-body font-bold tracking-tight text-txt-main'>
          {amount}
        </span>
        <span className='text-small font-semibold text-txt-muted'>
          {percent}
        </span>
      </div>
    </div>
  );
};

function DashboardPieChart({ data, dataKey }) {
  const formattedData = data?.map(item => ({
    ...item,
    fill: item.color,
  }));

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={formattedData}
        dataKey={dataKey}
        cx='50%'
        cy='50%'
        outerRadius='80%'
        stroke='none'
      />
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
}

export default DashboardPieChart;
