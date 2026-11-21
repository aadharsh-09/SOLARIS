import { formatCurrency } from '../utils/formatters';
import Card from './ui/Card';
import { CoinIcon } from './ui/Icons';

const kwh = (value) => `${Number(value).toFixed(2)} kWh`;

// Negative amounts are shown in brackets when used inside a formula
const inFormula = (value) =>
  value < 0 ? `(${formatCurrency(value)})` : formatCurrency(value);

const Row = ({ label, formula, result, highlight, tone }) => (
  <div className={`calc-row${highlight ? ' calc-row-total' : ''}${tone ? ` calc-row-${tone}` : ''}`}>
    <span className="calc-label">{label}</span>
    <span className="calc-formula">{formula}</span>
    <strong className="calc-result">{result}</strong>
  </div>
);

const FinancialBreakdown = ({ data }) => {
  const fin = data?.financial_analysis;
  const monthlyGen = data?.generation?.estimated_monthly_kwh;
  const dailyGen = data?.generation?.daily_kwh;
  const monthlyUsed = data?.household?.monthly_consumption_kwh;
  const dailyUsed = data?.household?.daily_consumption_kwh;
  const diff = data?.energy_comparison?.difference_kwh;

  if (!fin || [monthlyGen, dailyGen, monthlyUsed, dailyUsed, diff].some((v) => typeof v !== 'number')) {
    return null;
  }

  const gridTariff = fin.grid_tariff_inr_per_kwh;
  const exportTariff = fin.export_tariff_inr_per_kwh;
  const hasSurplus = diff > 0;
  const net = fin.net_bill_with_solar_inr;

  return (
    <Card title="Financial Analysis" icon={<CoinIcon />} className="financial-breakdown">

      <div className="calc-section">
        <h4>1. Monthly energy (30 days)</h4>
        <Row
          label="Solar generated"
          formula={`${dailyGen.toFixed(3)} kWh/day × 30`}
          result={kwh(monthlyGen)}
        />
        <Row
          label="Energy used"
          formula={`${dailyUsed} kWh/day × 30`}
          result={kwh(monthlyUsed)}
        />
        <Row
          tone={diff > 0 ? 'success' : diff < 0 ? 'warn' : undefined}
          label="Difference"
          formula={`${kwh(monthlyGen)} − ${kwh(monthlyUsed)}`}
          result={`${diff > 0 ? '+' : ''}${diff.toFixed(2)} kWh ${diff > 0 ? '(surplus)' : diff < 0 ? '(deficit)' : ''}`}
        />
      </div>

      <div className="calc-section">
        <h4>2. Bill without solar</h4>
        <Row
          label="Electricity bill"
          formula={`${kwh(monthlyUsed)} × ₹${gridTariff}/kWh`}
          result={formatCurrency(fin.grid_cost_without_solar_inr)}
        />
      </div>

      <div className="calc-section">
        <h4>3. Bill with solar</h4>
        <Row
          label="Bought from grid"
          formula={hasSurplus || diff === 0
            ? 'Solar covers all your usage'
            : `${kwh(monthlyUsed)} − ${kwh(monthlyGen)}`}
          result={kwh(fin.grid_energy_needed_kwh)}
        />
        <Row
          label="Grid bill"
          formula={`${kwh(fin.grid_energy_needed_kwh)} × ₹${gridTariff}/kWh`}
          result={formatCurrency(fin.grid_cost_with_solar_inr)}
        />
        <Row
          label="Exported to grid"
          formula={hasSurplus ? `${kwh(monthlyGen)} − ${kwh(monthlyUsed)}` : 'No surplus to export'}
          result={kwh(fin.surplus_exported_kwh)}
        />
        <Row
          label="Export credit"
          formula={`${kwh(fin.surplus_exported_kwh)} × ₹${exportTariff}/kWh`}
          result={formatCurrency(fin.export_credit_inr)}
        />
        <Row
          tone={net < 0 ? 'success' : undefined}
          label="Net bill with solar"
          formula={`${formatCurrency(fin.grid_cost_with_solar_inr)} − ${formatCurrency(fin.export_credit_inr)}`}
          result={net < 0 ? `${formatCurrency(-net)} credit` : formatCurrency(net)}
        />
      </div>

      <div className="calc-section">
        <h4>4. Monthly saving</h4>
        <Row
          highlight
          tone="success"
          label="You save"
          formula={`${formatCurrency(fin.grid_cost_without_solar_inr)} − ${inFormula(net)}`}
          result={formatCurrency(fin.total_monthly_benefit_inr)}
        />
      </div>
    </Card>
  );
};

export default FinancialBreakdown;
