import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

// Illustrative daily curve scaled to the API's daily total (the API only returns totals)
const HOURS = [6, 8, 10, 12, 14, 16, 18];
const SHAPE = [0.03, 0.12, 0.22, 0.26, 0.22, 0.12, 0.03];

const GenerationChart = ({ data }) => {
  const daily = data?.daily_kwh || 0;
  const chartData = HOURS.map((h, i) => ({
    hour: `${String(h).padStart(2, '0')}:00`,
    kwh: Number((daily * SHAPE[i]).toFixed(3)),
  }));

  return (
    <div className="chart-container">
      <h3>Estimated Daily Generation Profile</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="hour" />
            <YAxis unit=" kWh" width={70} />
            <Tooltip />
            <Line type="monotone" dataKey="kwh" name="Solar Generation" stroke="#FF9F1C" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenerationChart;
