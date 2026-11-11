import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite doesn't resolve Leaflet's default marker icon paths, so set them explicitly
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [13.0, 80.2]; // Chennai area

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

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(normalizeLocation(e.latlng.lat, e.latlng.lng));
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
      const qs = new URLSearchParams({ q: query, format: 'json', limit: '5' });
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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for a location..."
          className="location-search"
        />
        <button type="button" onClick={handleSearch} className="calculate-button">
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

  return (
    <div className="map-panel">
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={5}
        minZoom={2}
        worldCopyJump
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onLocationChange} />
        <FlyTo location={location} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
};
