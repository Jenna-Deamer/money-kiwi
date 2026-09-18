const valueSizes = {
  lg: 'text-metric-lg font-extrabold',
  md: 'text-metric-md font-bold',
  sm: 'text-metric-sm font-semibold',
};

function StatCard({ label, value, emphasis = 'md', tone, center = false, className }) {
  return (
    <div
      className={`card flex flex-col ${center ? 'items-center text-center' : 'justify-between'}${className ? ` ${className}` : ''}`}
    >
      <span className='eyebrow'>{label}</span>
      <p className={`${valueSizes[emphasis]} mt-2${tone ? ` ${tone}` : ''}`}>{value}</p>
    </div>
  );
}

export default StatCard;
