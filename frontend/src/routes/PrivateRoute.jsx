import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

  function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);  

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsValid(false);
      return;
    }

    const decoded = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (!decoded || decoded.exp < currentTime) {
      alert("Token tidak valid atau sudah expired. Silakan login ulang.");
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsValid(false);
      return;
    }

     const timeout = (decoded.exp - currentTime) * 1000;
    const timer = setTimeout(() => {
      alert("Token habis masa berlakunya. Kamu akan logout.");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setIsValid(false);
    }, timeout);

    setIsValid(true);

    return () => clearTimeout(timer);
  }, []);

  if (isValid === null) return null; // atau loading spinner

  return isValid ? children : <Navigate to="/" />;
};

export default PrivateRoute;