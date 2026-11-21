// Shared surface used by the form, chart, weather and financial sections.
const Card = ({ title, icon, accent = 'teal', className = '', children }) => (
  <section className={`card ${className}`.trim()}>
    {title && (
      <header className="card-header">
        {icon && <span className={`icon-tile icon-tile-${accent}`}>{icon}</span>}
        <h3 className="card-title">{title}</h3>
      </header>
    )}
    {children}
  </section>
);

export default Card;
