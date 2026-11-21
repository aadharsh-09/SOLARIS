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
  // Snapshot of the location + inputs taken when "Calculate Analysis" is clicked.
  // Results only change when this changes, never on map clicks or typing.
  const [request, setRequest] = useState(null);

  const handleCalculate = (values) => {
    setFormData(values);
    setRequest({ location: selectedLocation, formData: values });
  };

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
          <SolarSystemForm
            data={formData}
            onChange={handleCalculate}
            hasLocation={Boolean(selectedLocation)}
          />
        </section>

        <section className="live-data">
          <h2 className="section-title">Live Data</h2>
          {request ? (
            <ResultsDashboard location={request.location} formData={request.formData} />
          ) : (
            <div className="placeholder">
              <p>
                {selectedLocation
                  ? 'Fill in your system details and click Calculate Analysis'
                  : 'Search for a place or click the map to choose a location, then click Calculate Analysis'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
