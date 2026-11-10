import { useState, useEffect } from 'react';

const HouseholdForm = ({ onChange }) => {
  const [formData, setFormData] = useState({
    daily_consumption: 12,
    grid_tariff: 8,
    export_tariff: 3
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setError(null);
    try {
      const {
        daily_consumption,
        grid_tariff,
        export_tariff
      } = formData;

      if (daily_consumption < 0) {
        setError('Daily consumption must be greater than or equal to 0');
        return;
      }

      if (grid_tariff < 0) {
        setError('Grid tariff must be greater than or equal to 0');
        return;
      }

      if (export_tariff < 0) {
        setError('Export tariff must be greater than or equal to 0');
        return;
      }

      onChange(formData);
    } catch (err) {
      setError('Failed to validate form data');
      console.error('Form validation error:', err);
    }
  };

  return (
    <div className="household-form">
      <h2>Household Energy Usage</h2>
      <div className="form-row">
        <label>
          Average Daily Household Consumption (kWh):
          <input
            type="number"
            name="daily_consumption"
            value={formData.daily_consumption}
            onChange={handleChange}
            min="0"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Grid Electricity Tariff (₹/kWh):
          <input
            type="number"
            name="grid_tariff"
            value={formData.grid_tariff}
            onChange={handleChange}
            min="0"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Export Tariff / Credit (₹/kWh):
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
        Confirm Values
      </button>
    </div>
  );
};

export default HouseholdForm;