import React from 'react';

// css
import style from './index.module.scss';

// util
import { onPreview } from '@/utils';

interface TopDisplayProps {
  img: any;
}

const TopDisplay: React.FC<TopDisplayProps> = ({ img }) => {
  return (
    <div
      className={style.logo}
      style={{ backgroundImage: `url(${img})` }}
      onClick={() => {
        onPreview(img);
      }}
    >
      <div>Photo Time Line</div>
    </div>
  );
};

export default TopDisplay;
