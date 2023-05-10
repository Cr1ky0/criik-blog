import React from 'react';
import Cookies from 'universal-cookie';
import { useLocation } from 'react-router';
import Page403 from '@/components/ErrorPage/Page403';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const cookies = new Cookies();
  const user = cookies.get('user');
  const location = useLocation();
  const path = location.pathname;
  return <>{path !== '/manage' || user ? children : <Page403></Page403>}</>;
};

export default AuthRoute;
