import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const cookies = new Cookies();
  const user = cookies.get('user');
  const message = useGlobalMessage();
  return (
    <>
      {user ? children : <Navigate to="/" />}
      {/* message放这里不会报错 */}
      {user
        ? undefined
        : (() => {
            message.error('请登录后操作');
            return undefined;
          })()}
    </>
  );
};

export default AuthRoute;
