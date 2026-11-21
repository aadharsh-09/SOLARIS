import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
import Card from './ui/Card';
import { ChartIcon } from './ui/Icons';
import { CHART_COLORS, axisProps, gridProps, tooltipProps } from './chartTheme';

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
    <Card title="Estimated Daily Generation Profile" icon={<ChartIcon />} className="chart-container">
      <div className="chart-area chart-area-lg">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="genFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.teal} stopOpacity={0.28} />
                <stop offset="100%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="hour" {...axisProps} />
            <YAxis unit=" kWh" width={70} {...axisProps} axisLine={false} />
            <Tooltip {...tooltipProps} />
            <Area
              type="monotone"
              dataKey="kwh"
              name="Solar Generation"
              stroke={CHART_COLORS.teal}
              strokeWidth={2.5}
              fill="url(#genFill)"
              activeDot={{ r: 5, fill: CHART_COLORS.teal, stroke: CHART_COLORS.surface, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GenerationChart;
