import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message" style={{ backgroundColor: '#ffcccc', padding: '1rem', margin: '1rem 0', borderRadius: '4px' }}>
      <h4 className="error-title">Error</h4>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;