import React from 'react';
import Cookies from 'universal-cookie';
import { useLocation } from 'react-router';
import Page401 from '@/components/ErrorPage/Page401';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const cookies = new Cookies();
  const user = cookies.get('user');
  const location = useLocation();
  const path = location.pathname;
  return <>{path !== '/manage' || user ? children : <Page401></Page401>}</>;
};

export default AuthRoute;
