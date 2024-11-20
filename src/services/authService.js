// src/services/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../constants';

const API = axios.create({
  baseURL: BASE_URL+'/api/',
  headers: { 'Content-Type': 'application/json' },
});


export const login = async (email, password) => {
  const response = await API.post('/auth/token/obtain/', { email, password });
  if (response.data.access) {
    Cookies.set('token', response.data.access);
  }
  return response.data;
};

export const register = async (email, username, password) => {
  const response = await API.post('/auth/register/', { email, username, password });
  if (response.data.access) {
    Cookies.set('token', response.data.access);
  }
  return response.data;
};

export const logout = () => {
  Cookies.remove('token');
};

export const getToken = () => Cookies.get('token');

export const resetPassword = async (email) => {
  const response = await API.post('auth/request-otp/', { email });
  return response.data;
};

export const confirmResetPassword = async (email, otp, password) => {
  const response = await API.post('auth/reset-password/', {
    email,
    otp,
    password,
  });
  return response.data;
};
