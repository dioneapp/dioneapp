import { useState } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    setError(err);
  };

  return { error, handleError };
}
