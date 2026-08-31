import { Pie, PieChart, Tooltip } from 'recharts';

function DashboardPieChart({ data, dataKey }) {
  const formattedData = data?.map(item => ({
    ...item,
    fill: item.color
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
      <Tooltip
        formatter={(value) => `$${Number(value).toFixed(2)}`}
        contentStyle={{
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
        itemStyle={{
          color: '#2D3748',
          fontWeight: '600',
        }}
      />
    </PieChart>
  );
}

export default DashboardPieChart;
