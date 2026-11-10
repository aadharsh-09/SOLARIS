export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === 0) return '₹0';
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

export const formatUnits = (value, unit) => {
  if (value === null || value === undefined) return 'N/A';
  if (unit === 'kWh/day' || unit === 'kWh/month' || unit === 'kWh/m²/day') {
    return value.toFixed(3) + ' ' + unit;
  }
  if (unit === 'INR') {
    return formatCurrency(value);
  }
  return value + ' ' + unit;
};