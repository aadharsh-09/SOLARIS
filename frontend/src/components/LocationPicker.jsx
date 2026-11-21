import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchIcon } from './ui/Icons';

// Teal location pin (replaces Leaflet's default blue marker, so no image files are needed)
const PIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">' +
  '<path d="M16 40S3 28.5 3 16.5a13 13 0 0 1 26 0C29 28.5 16 40 16 40Z" fill="#45D6B0" stroke="#0B1220" stroke-width="2"/>' +
  '<circle cx="16" cy="16.5" r="5" fill="#0B1220"/></svg>';

const pinIcon = L.divIcon({
  html: PIN_SVG,
  className: 'location-pin',
  iconSize: [32, 42],
  iconAnchor: [16, 40],
});

const DEFAULT_CENTER = [13.0, 80.2]; // Chennai area

// Rough bounding box around India: the map is locked to it and clicks outside are ignored
const INDIA_BOUNDS = [[6.0, 68.0], [37.5, 97.5]];
const isInIndiaBounds = (lat, lng) =>
  lat >= INDIA_BOUNDS[0][0] && lat <= INDIA_BOUNDS[1][0] &&
  lng >= INDIA_BOUNDS[0][1] && lng <= INDIA_BOUNDS[1][1];

// Leaflet repeats the world horizontally, so clicking a repeated copy of the map
// gives a longitude like 260 or -200. The backend only accepts -180..180, so
// always wrap longitude (and clamp latitude) before it leaves the map.
export function normalizeLocation(latitude, longitude) {
  const lat = Math.max(-90, Math.min(90, Number(latitude)));
  const lon = ((((Number(longitude) + 180) % 360) + 360) % 360) - 180;
  return {
    latitude: Number(lat.toFixed(6)),
    longitude: Number(lon.toFixed(6)),
  };
}

// Asks Nominatim what is at the clicked point. Ocean or other countries are rejected.
// Returns true (India), false (not India / sea) or null (lookup failed).
async function isIndianLand(lat, lng) {
  try {
    const qs = new URLSearchParams({
      lat: String(lat), lon: String(lng), format: 'json', zoom: '8', addressdetails: '1',
    });
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${qs}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.address?.country_code === 'in';
  } catch {
    return null;
  }
}

function ClickHandler({ onPick, onStatus }) {
  const latest = useRef(0);
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      if (!isInIndiaBounds(lat, lng)) {
        onStatus('Please select a location in India');
        return;
      }
      const id = ++latest.current;
      onStatus('Checking location...');
      const ok = await isIndianLand(lat, lng);
      if (id !== latest.current) return; // a newer click replaced this one
      if (ok === null) {
        onStatus('Could not verify that location, please try again');
      } else if (!ok) {
        onStatus('Please select a location in India');
      } else {
        onStatus(null);
        onPick(normalizeLocation(lat, lng));
      }
    },
  });
  return null;
}

function FlyTo({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], Math.max(map.getZoom(), 10));
    }
  }, [location, map]);
  return null;
}

export const SearchBox = ({ onPick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setError(null);
      const qs = new URLSearchParams({ q: query, format: 'json', limit: '5', countrycodes: 'in' });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`);
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      setResults(json);
      if (json.length === 0) setError('No matches found');
    } catch (err) {
      setError('Failed to search location');
      console.error('Search error:', err);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        <div className="search-input-wrap">
          <SearchIcon size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a location..."
            className="location-search"
            aria-label="Search for a location"
          />
        </div>
        <button type="button" onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>
      {error && <div className="search-error">{error}</div>}
      {results.length > 0 && (
        <ul className="search-results-list">
          {results.map((item) => (
            <li
              key={item.place_id}
              className="search-result-item"
              onClick={() => {
                setQuery(item.display_name);
                setResults([]);
                onPick(normalizeLocation(parseFloat(item.lat), parseFloat(item.lon)));
              }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MapPanel = ({ location, onLocationChange }) => {
  const position = location ? [location.latitude, location.longitude] : null;
  const [status, setStatus] = useState(null);

  return (
    <div className="map-panel">
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={5}
        minZoom={4}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onLocationChange} onStatus={setStatus} />
        <FlyTo location={location} />
        {position && <Marker position={position} icon={pinIcon} />}
      </MapContainer>
      {status && <div className="map-status" role="status">{status}</div>}
    </div>
  );
};
