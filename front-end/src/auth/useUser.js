import { useState, useEffect } from 'react';
import { useToken } from './useToken';

export const useUser = () => {
  // Get the token
  const [token] = useToken();

  // A function for getting the payload from the token
  // and parse it to a JSON Obj
  const getBodyFromToken = (token) => {
    const encodedBody = token.split('.')[1];
    return JSON.parse(atob(encodedBody));
  };

  // If token doesn't exist, user is not logged in
  const [user, setUser] = useState(() => {
    if (!token) return null;
    return getBodyFromToken(token);
  });

  // Watch the token for changes and updated the user
  // to make sure the token and the user are in sync
  useEffect(() => {
    if (!token) setUser(null);
    else setUser(getBodyFromToken(token));
  }, [token]);

  return user;
};
