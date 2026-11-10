import { useState } from 'react';

const SolarSystemForm = ({ data, onChange }) => {
  const [formData, setFormData] = useState(data);

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const numeric = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, Number(v)])
      );
      if (Object.values(numeric).some((v) => Number.isNaN(v))) {
        setError('Please fill in every field with a valid number');
        return;
      }

      if (numeric.capacity_kw <= 0) {
        setError('Capacity must be greater than 0');
        return;
      }

      if (numeric.tilt < 0 || numeric.tilt > 90) {
        setError('Tilt must be between 0 and 90 degrees');
        return;
      }

      if (numeric.azimuth < -180 || numeric.azimuth > 180) {
        setError('Azimuth must be between -180 and 180 degrees');
        return;
      }

      if (numeric.performance_ratio <= 0 || numeric.performance_ratio > 1) {
        setError('Performance ratio must be between 0 and 1');
        return;
      }

      if (numeric.daily_consumption < 0) {
        setError('Daily consumption must be greater than or equal to 0');
        return;
      }

      if (numeric.grid_tariff < 0) {
        setError('Grid tariff must be greater than or equal to 0');
        return;
      }

      if (numeric.export_tariff < 0) {
        setError('Export tariff must be greater than or equal to 0');
        return;
      }

      onChange(numeric);
    } catch (err) {
      setError('Failed to validate form data');
      console.error('Form validation error:', err);
    }
  };

  return (
    <div className="solar-form">
      <h2>Solar System Configuration</h2>
      <div className="form-row">
        <label>
          Installed Capacity (kW):
          <input
            type="number"
            name="capacity_kw"
            value={formData.capacity_kw}
            onChange={handleChange}
            min="0"
            step="0.1"
          />
        </label>
        <label>
          Panel Tilt (degrees):
          <input
            type="number"
            name="tilt"
            value={formData.tilt}
            onChange={handleChange}
            min="0"
            max="90"
          />
        </label>
        <label>
          Panel Azimuth (degrees):
          <input
            type="number"
            name="azimuth"
            value={formData.azimuth}
            onChange={handleChange}
            min="-180"
            max="180"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Performance Ratio:
          <input
            type="number"
            name="performance_ratio"
            value={formData.performance_ratio}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="1"
          />
          <small>Typical range: 0.7-0.9</small>
        </label>
      </div>

      <div className="form-row">
        <label>
          Daily Household Consumption (kWh):
          <input
            type="number"
            name="daily_consumption"
            value={formData.daily_consumption}
            onChange={handleChange}
            min="0"
          />
        </label>
        <label>
          Grid Tariff (₹/kWh):
          <input
            type="number"
            name="grid_tariff"
            value={formData.grid_tariff}
            onChange={handleChange}
            min="0"
          />
        </label>
        <label>
          Export Tariff (₹/kWh):
          <input
            type="number"
            name="export_tariff"
            value={formData.export_tariff}
            onChange={handleChange}
            min="0"
          />
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}
      <button
        type="button"
        onClick={handleSubmit}
        className="calculate-button"
      >
        Calculate Analysis
      </button>
    </div>
  );
};

export default SolarSystemForm;