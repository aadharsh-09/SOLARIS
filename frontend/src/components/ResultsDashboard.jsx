import { useEffect } from 'react';
import { useSolarData } from '../api/solarApi';
import MetricCard from './MetricCard';
import GenerationChart from './GenerationChart';
import FinancialBreakdown from './FinancialBreakdown';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';

const ResultsDashboard = ({ location, formData }) => {
  const { data, loading, error, fetchSolarData } = useSolarData();

  useEffect(() => {
    if (!location) return;
    fetchSolarData({
      latitude: location.latitude,
      longitude: location.longitude,
      tilt: formData.tilt,
      azimuth: formData.azimuth,
      capacity_kw: formData.capacity_kw,
      daily_consumption: formData.daily_consumption,
      grid_tariff: formData.grid_tariff,
      export_tariff: formData.export_tariff,
      performance_ratio: formData.performance_ratio,
    });
  }, [location, formData, fetchSolarData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="results-dashboard">
      <div className="dashboard-grid">
        <MetricCard title="Daily Generation" value={data.generation?.daily_kwh} unit="kWh/day" />
        <MetricCard title="Monthly Generation" value={data.generation?.estimated_monthly_kwh} unit="kWh/month" />
        <MetricCard title="Daily Irradiation" value={data.solar_irradiation?.daily_kwh_m2} unit="kWh/m²/day" />
        <MetricCard title="Daily Consumption" value={data.household?.daily_consumption_kwh} unit="kWh/day" />
        <MetricCard title="Monthly Energy Difference" value={data.energy_comparison?.difference_kwh} unit="kWh/month" />
      </div>

      <div className="dashboard-charts">
        <GenerationChart data={data.generation} />
        <FinancialBreakdown data={data.financial_analysis} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
