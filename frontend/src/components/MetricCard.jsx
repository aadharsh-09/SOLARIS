import { formatUnits } from '../utils/formatters';

const MetricCard = ({ title, value, unit }) => {
  return (
    <div className="metric-card">
      <h3 className="metric-title">{title}</h3>
      <p className="metric-value">
        {typeof value === 'number' ? formatUnits(value, unit) : 'N/A'}
      </p>
    </div>
  );
};

export default MetricCard;
