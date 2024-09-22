import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

function Protected({children}) {
  const authToken = localStorage.getItem('auth_token');
  
  if(!authToken) {
    return <Navigate to="/" replace={true}></Navigate>
  }
  return children;
}

export default Protected;
