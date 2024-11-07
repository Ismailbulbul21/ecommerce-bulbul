import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { checkAdminStatus } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
      }
      setCheckingAdmin(false);
    };

    checkAdmin();
  }, [user]);

  if (loading || checkingAdmin) {
    return <LoadingSpinner />;
  }

  return user && isAdmin ? children : <Navigate to="/" />;
}

export default AdminRoute; 