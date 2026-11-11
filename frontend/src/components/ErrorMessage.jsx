const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <h4 className="error-title">Error</h4>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
