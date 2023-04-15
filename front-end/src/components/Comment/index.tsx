import React, { useEffect } from 'react';

// waline
import '@waline/client/dist/waline.css';
import { init } from '@waline/client/dist/waline';

// css
import './index.scss';

const Comment = () => {
  useEffect(() => {
    init({
      el: '#waline',
      serverURL: 'https://your-domain.vercel.app',
    });
  }, []);

  return <div id="waline"></div>;
};

export default Comment;
