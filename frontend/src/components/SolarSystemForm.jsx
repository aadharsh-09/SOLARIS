import { useState } from 'react';

// The user picks a direction name only; the backend turns it into an angle.
const FACING_OPTIONS = [
  { value: 'N', label: 'North' },
  { value: 'NE', label: 'North-East' },
  { value: 'E', label: 'East' },
  { value: 'SE', label: 'South-East' },
  { value: 'S', label: 'South' },
  { value: 'SW', label: 'South-West' },
  { value: 'W', label: 'West' },
  { value: 'NW', label: 'North-West' },
];

const NUMERIC_FIELDS = ['capacity_kw', 'tilt', 'daily_consumption'];

const SolarSystemForm = ({ data, onChange, hasLocation }) => {
  const [formData, setFormData] = useState(data);

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!hasLocation) {
      setError('Please choose a location on the map (or search for one) first');
      return;
    }
    try {
      const numeric = Object.fromEntries(
        NUMERIC_FIELDS.map((k) => [k, Number(formData[k])])
      );
      if (
        Object.values(numeric).some((v) => Number.isNaN(v)) ||
        NUMERIC_FIELDS.some((k) => String(formData[k]).trim() === '')
      ) {
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

      if (!FACING_OPTIONS.some((o) => o.value === formData.facing)) {
        setError('Please choose the direction the panels face');
        return;
      }

      if (numeric.daily_consumption < 0) {
        setError('Daily consumption must be greater than or equal to 0');
        return;
      }

      onChange({ ...numeric, facing: formData.facing });
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
      </div>

      <div className="form-row">
        <label>
          Panel Facing Direction:
          <select
            name="facing"
            value={formData.facing}
            onChange={handleChange}
          >
            {FACING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Daily Energy Consumption (kWh):
          <input
            type="number"
            name="daily_consumption"
            value={formData.daily_consumption}
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
