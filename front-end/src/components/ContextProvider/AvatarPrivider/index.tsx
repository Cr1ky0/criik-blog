import React, { useContext, createContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { avatarAjax } from '@/api/user';

// default.png
import img from '@/assets/images/default.png';

interface avatarContextProps {
  children?: React.ReactNode;
}

const avatarContext = createContext('');
const AvatarProvider: React.FC<avatarContextProps> = ({ children }) => {
  const [avatar, setAvatar] = useState(img);
  const cookies = new Cookies();
  const user = cookies.get('user');
  useEffect(() => {
    if (user)
      avatarAjax(user.avatar)
        .then(response => {
          const reader = new FileReader();
          reader.onload = e => {
            if (e.target) setAvatar(e.target.result as string);
          };
          reader.readAsDataURL(response);
        })
        .catch(err => {
          console.log(err.message);
        });
  }, [user]);
  return <avatarContext.Provider value={avatar}>{children}</avatarContext.Provider>;
};

export default AvatarProvider;

export const useAvatar = () => {
  return useContext(avatarContext);
};
