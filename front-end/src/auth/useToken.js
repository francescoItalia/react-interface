import { useState } from 'react';

export const useToken = () => {
  // Internal State linked to the user local storage
  const [token, setTokenInternal] = useState(() =>
    // If there is a token in the local storage, set it in the hook
    localStorage.getItem('token')
  );

  // Set the token in the local storage when the user wants to change it
  const setToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setTokenInternal(newToken);
  };

  return [token, setToken];
};
