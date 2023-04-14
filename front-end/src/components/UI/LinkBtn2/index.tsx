import React from 'react';

// css
import style from './index.module.scss';

interface LinkBtn2Props {
  text: string;
}

const LinkBtn2: React.FC<LinkBtn2Props> = props => {
  const { text } = props;
  return (
    <>
      <div className={style.wrapper}>
        <div>{text}</div>
        <div className={style.bar}></div>
      </div>
    </>
  );
};

export default LinkBtn2;
