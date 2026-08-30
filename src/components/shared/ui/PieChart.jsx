import { Pie, PieChart, Tooltip } from 'recharts';

function DashboardPieChart({ data, colors, dataKey }) {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey={dataKey}
        cx='50%'
        cy='50%'
        outerRadius='80%'
        fill='#8884d8'
        stroke='white'
      />
      <Tooltip />
    </PieChart>
  );
}

export default DashboardPieChart;
