const LoadingState = () => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Calculating your solar potential...</p>
    </div>
  );
};

export default LoadingState;
