import { useState } from 'react';
import { SearchBox, MapPanel } from './components/LocationPicker';
import SolarSystemForm from './components/SolarSystemForm';
import ResultsDashboard from './components/ResultsDashboard';

const DEFAULT_FORM = {
  capacity_kw: 3,
  tilt: 20,
  facing: 'S',
  daily_consumption: 12,
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span className="accent">SOLARIS</span> - Solar Analysis Dashboard
        </h1>
      </header>

      <main className="container">
        <SearchBox onPick={setSelectedLocation} />

        <section className="workspace">
          <MapPanel location={selectedLocation} onLocationChange={setSelectedLocation} />
          <SolarSystemForm data={formData} onChange={setFormData} />
        </section>

        <section className="live-data">
          <h2 className="section-title">Live Data</h2>
          {selectedLocation ? (
            <ResultsDashboard location={selectedLocation} formData={formData} />
          ) : (
            <div className="placeholder">
              <p>Search for a place or click the map to choose a location</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
