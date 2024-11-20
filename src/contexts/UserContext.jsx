import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../constants';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await axios.get(`${BASE_URL}/api/auth/token/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Assume the response JSON contains the user object
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logoutToken();
    }
  };

  const loginToken = async (token) => {
    Cookies.set('token', token);
    setIsLoggedIn(true);
    await fetchUser();
  };

  const logoutToken = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  return (
    <UserContext.Provider value={{ isLoggedIn, user, loginToken, logoutToken, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
