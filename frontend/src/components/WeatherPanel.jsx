import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';

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
  }));

  return (
    <div className="weather-panel">
      <div className="weather-text">
        <h3>Current Weather</h3>
        <div className="weather-now">
          <span className="weather-icon" aria-hidden="true">{icon}</span>
          <div>
            <p className="weather-temp">{show(current.temperature, '°C')}</p>
            <p className="weather-condition">{text}</p>
          </div>
        </div>

        <ul className="weather-stats">
          <li><span>Feels like</span><strong>{show(current.feels_like, '°C')}</strong></li>
          <li><span>Humidity</span><strong>{show(current.humidity, '%')}</strong></li>
          <li><span>Cloud cover</span><strong>{show(current.cloud_cover, '%')}</strong></li>
          <li><span>Wind</span><strong>{show(current.wind_speed, ' km/h')}</strong></li>
          <li><span>Rain</span><strong>{show(current.precipitation, ' mm')}</strong></li>
        </ul>
      </div>

      <div className="weather-chart">
        <h3>Today&apos;s Hourly Temperature</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
              <XAxis dataKey="hour" stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 12 }} interval={2} />
              <YAxis unit="°C" width={55} stroke="#ffffff" tick={{ fill: '#ffffff' }} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: '#0a1f44', border: '1px solid #FF9F1C', color: '#fff' }} labelStyle={{ color: '#fff' }} />
              <ReferenceLine x={hourLabel(current.time)} stroke="#ffffff" strokeDasharray="4 4" label={{ value: 'Now', fill: '#ffffff', position: 'top' }} />
              <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#FF9F1C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
