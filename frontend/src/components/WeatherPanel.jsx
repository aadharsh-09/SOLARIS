import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';
import { CloudIcon, DropIcon, ThermoIcon } from './ui/Icons';
import { CHART_COLORS, axisProps, gridProps, tooltipProps } from './chartTheme';

// WMO weather codes (as returned by Open-Meteo) -> short text + icon
const describeWeather = (code, isDay) => {
  if (code === 0) return { text: 'Clear sky', icon: isDay ? '☀️' : '🌙' };
  if (code === 1) return { text: 'Mainly clear', icon: isDay ? '🌤️' : '🌙' };
  if (code === 2) return { text: 'Partly cloudy', icon: '⛅' };
  if (code === 3) return { text: 'Overcast', icon: '☁️' };
  if (code === 45 || code === 48) return { text: 'Fog', icon: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { text: 'Drizzle', icon: '🌦️' };
  if ([61, 63, 65, 66, 67].includes(code)) return { text: 'Rain', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: 'Snow', icon: '🌨️' };
  if ([80, 81, 82].includes(code)) return { text: 'Rain showers', icon: '🌦️' };
  if ([95, 96, 99].includes(code)) return { text: 'Thunderstorm', icon: '⛈️' };
  return { text: 'Unknown', icon: '🌡️' };
};

const hourLabel = (time) => (time ? `${time.slice(11, 13)}:00` : '');

const show = (value, unit) =>
  value === null || value === undefined ? 'N/A' : `${value}${unit}`;

const WeatherPanel = ({ weather }) => {
  const current = weather?.current;
  const hourly = weather?.hourly;
  if (!current || !hourly?.length) return null;

  const { text, icon } = describeWeather(current.weather_code, current.is_day);

  const chartData = hourly.map((h) => ({
    hour: hourLabel(h.time),
    temperature: h.temperature,
    irradiance: h.irradiance,
  }));

  const nowLabel = hourLabel(current.time);

  return (
    <div className="weather-panel">
      <div className="weather-summary">
        <h3>Current Weather</h3>
        <div className="weather-summary-row">
          <div className="weather-now">
            <span className="weather-icon" aria-hidden="true">{icon}</span>
            <div>
              <p className="weather-temp">{show(current.temperature, '°C')}</p>
              <p className="weather-condition">{text}</p>
            </div>
          </div>

          <ul className="weather-stats">
            <li><span><ThermoIcon size={15} />Feels like</span><strong>{show(current.feels_like, '°C')}</strong></li>
            <li><span><CloudIcon size={15} />Cloud cover</span><strong>{show(current.cloud_cover, '%')}</strong></li>
            <li><span><DropIcon size={15} />Rain</span><strong>{show(current.precipitation, ' mm')}</strong></li>
          </ul>
        </div>
      </div>

      <div className="weather-charts">
        <div className="weather-chart">
          <h3>Today&apos;s Hourly Temperature</h3>
          <div className="chart-area">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="hour" {...axisProps} interval={2} />
                <YAxis unit="°C" width={55} {...axisProps} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip {...tooltipProps} />
                <ReferenceLine x={nowLabel} stroke={CHART_COLORS.axis} strokeDasharray="4 4" label={{ value: 'Now', fill: CHART_COLORS.axis, position: 'top', fontSize: 12 }} />
                <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke={CHART_COLORS.teal} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="weather-chart">
          <h3>Solar Irradiance Throughout the Day</h3>
          <div className="chart-area">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="hour" {...axisProps} interval={2} />
                <YAxis unit=" W/m²" width={80} {...axisProps} axisLine={false} domain={[0, 'auto']} />
                <Tooltip {...tooltipProps} />
                <ReferenceLine x={nowLabel} stroke={CHART_COLORS.axis} strokeDasharray="4 4" label={{ value: 'Now', fill: CHART_COLORS.axis, position: 'top', fontSize: 12 }} />
                <Area type="monotone" dataKey="irradiance" name="Irradiance (W/m²)" stroke={CHART_COLORS.solar} strokeWidth={2.5} fill={CHART_COLORS.solar} fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
