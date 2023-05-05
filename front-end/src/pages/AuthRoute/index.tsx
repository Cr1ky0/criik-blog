import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate, useLocation } from 'react-router';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const cookies = new Cookies();
  const user = cookies.get('user');
  const message = useGlobalMessage();
  const location = useLocation();
  const path = location.pathname;
  return (
    <>
      {path !== '/manage' || user ? children : <Navigate to="/" />}
      {/* message放这里不会报错 */}
      {path !== '/manage' || user
        ? undefined
        : (() => {
            message.error('请登录后操作');
            return undefined;
          })()}
    </>
  );
};

export default AuthRoute;
