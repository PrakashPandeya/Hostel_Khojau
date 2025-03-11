import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or any other desired page
    window.location.href = '/login';
  };

  return (
    <a href="#" onClick={handleLogout}>
      Logout
    </a>
  );
};

export default Logout;
