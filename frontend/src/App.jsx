import { useRef, useState } from 'react';
import { SearchBox, MapPanel } from './components/LocationPicker';
import SolarSystemForm from './components/SolarSystemForm';
import ResultsDashboard from './components/ResultsDashboard';
import { LogoMark } from './components/ui/Icons';

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

  const workspaceRef = useRef(null);

  // On phones the form sits below the map. After a valid pick (map tap or search
  // result), scroll down to it.
  const handlePick = (location) => {
    setSelectedLocation(location);
    if (!window.matchMedia('(max-width: 900px)').matches) return;
    // short pause so the pin is seen dropping before the page moves
    setTimeout(() => {
      const form = workspaceRef.current?.querySelector('.card');
      if (!form) return;
      const headerHeight = document.querySelector('.header')?.offsetHeight ?? 0;
      const top = form.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 400);
  };

  const handleCalculate = (values) => {
    setFormData(values);
    setRequest({ location: selectedLocation, formData: values });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <LogoMark />
            <span className="brand-name">SOLARIS</span>
            <span className="brand-sub">Solar Analysis Dashboard</span>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="intro">
          <h1 className="intro-title">Solar energy, intelligently analysed.</h1>
          <p className="intro-text">
            Understand your solar generation, energy usage and monthly savings through
            location-based simulation.
          </p>
        </section>

        <SearchBox onPick={handlePick} />

        <section className="workspace" ref={workspaceRef}>
          <MapPanel location={selectedLocation} onLocationChange={handlePick} />
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
