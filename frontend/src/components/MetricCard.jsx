import { formatUnits } from '../utils/formatters';

// Presentation only: the value still comes from formatUnits, we just split
// the number from its unit so they can be styled separately.
const MetricCard = ({ title, value, unit, icon, accent = 'teal' }) => {
  const text = typeof value === 'number' ? formatUnits(value, unit) : 'N/A';
  const spaceAt = text.indexOf(' ');
  const hasUnit = typeof value === 'number' && spaceAt > 0;
  const figure = hasUnit ? text.slice(0, spaceAt) : text;
  const suffix = hasUnit ? text.slice(spaceAt + 1) : '';

  return (
    <div className="metric-card">
      <div className="metric-head">
        {icon && <span className={`icon-tile icon-tile-${accent}`}>{icon}</span>}
        <h3 className="metric-title">{title}</h3>
      </div>
      <p className="metric-value">
        <span className="metric-figure">{figure}</span>
        {suffix && <span className="metric-unit">{suffix}</span>}
      </p>
    </div>
  );
};

export default MetricCard;
