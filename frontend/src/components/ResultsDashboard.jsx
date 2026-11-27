import { useEffect, useRef } from 'react';
import { useSolarData } from '../api/solarApi';
import MetricCard from './MetricCard';
import GenerationChart from './GenerationChart';
import FinancialBreakdown from './FinancialBreakdown';
import WeatherPanel from './WeatherPanel';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';

const ResultsDashboard = ({ location, formData }) => {
  const { data, loading, error, fetchSolarData } = useSolarData();
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!location) return;
    // Runs only when a new calculation is requested (Calculate Analysis click).
    // The zero-delay timer is cancelled by cleanup, so React dev mode's double
    // effect run doesn't send the request twice.
    const timer = setTimeout(() => {
      fetchSolarData({
        latitude: location.latitude,
        longitude: location.longitude,
        tilt: formData.tilt,
        facing: formData.facing,
        capacity_kw: formData.capacity_kw,
        daily_consumption: formData.daily_consumption,
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [location, formData, fetchSolarData]);

  // Once the results have loaded, scroll them into view (handy on phones).
  useEffect(() => {
    if (data && !loading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data, loading]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="results-dashboard" ref={resultsRef}>
      <div className="dashboard-grid">
        <MetricCard title="Daily Generation" value={data.generation?.daily_kwh} unit="kWh/day" />
        <MetricCard title="Daily Consumption" value={data.household?.daily_consumption_kwh} unit="kWh/day" />
        <MetricCard title="Daily Irradiation" value={data.solar_irradiation?.daily_kwh_m2} unit="kWh/m²/day" />
      </div>

      <WeatherPanel weather={data.weather} />

      <div className="dashboard-charts">
        <GenerationChart data={data.generation} />
        <FinancialBreakdown data={data} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
