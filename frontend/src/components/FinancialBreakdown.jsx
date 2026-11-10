import { formatCurrency } from '../utils/formatters';

const FinancialBreakdown = ({ data }) => {
  return (
    <div className="financial-breakdown">
      <h3>Financial Analysis</h3>
      <div className="breakdown-grid">
        <div className="breakdown-item">
          <h4>Grid Cost Without Solar</h4>
          <p className="breakdown-value">{formatCurrency(data.grid_cost_without_solar_inr)}</p>
        </div>
        <div className="breakdown-item">
          <h4>Solar Energy Used</h4>
          <p className="breakdown-value">
            {data.solar_energy_used_kwh > 0 ? data.solar_energy_used_kwh + ' kWh' : 'N/A'}
          </p>
        </div>
        <div className="breakdown-item">
          <h4>Money Saved</h4>
          <p className="breakdown-value">{formatCurrency(data.money_saved_inr)}</p>
        </div>
        <div className="breakdown-item">
          <h4>Export Credit</h4>
          <p className="breakdown-value">{formatCurrency(data.export_credit_inr)}</p>
        </div>
        <div className="breakdown-item">
          <h4>Total Monthly Benefit</h4>
          <p className="breakdown-value">{formatCurrency(data.total_monthly_benefit_inr)}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialBreakdown;