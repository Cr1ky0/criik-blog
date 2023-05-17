import React, { useContext, createContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { avatarAjax } from '@/api/user';

// default.png
import img from '@/assets/images/default.webp';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface avatarContextProps {
  children?: React.ReactNode;
}

const avatarContext = createContext(img);
const AvatarProvider: React.FC<avatarContextProps> = ({ children }) => {
  const message = useGlobalMessage();
  const [avatar, setAvatar] = useState(img);
  const cookies = new Cookies();
  const user = cookies.get('user');

  useEffect(() => {
    if (user)
      avatarAjax(
        user.avatar,
        response => {
          const reader = new FileReader();
          reader.onload = e => {
            if (e.target) setAvatar(e.target.result as string);
          };
          reader.readAsDataURL(response);
        },
        msg => {
          message.error(msg);
        }
      );
  }, [user]);
  return <avatarContext.Provider value={avatar}>{children}</avatarContext.Provider>;
};

export default AvatarProvider;

export const useAvatar = () => {
  return useContext(avatarContext);
};
