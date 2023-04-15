import React, { useEffect, useState } from 'react';

import axios from 'axios';

interface emojiObj {
  key: string;
  value: string;
}

const Emoji = () => {
  const [emojis, setEmojis] = useState<emojiObj[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3002/emoji.json').then(
      response => {
        // 将json转化为对象
        const list: emojiObj[] = [];
        Object.entries(response.data).map(([key, value]) => {
          list.push({ key, value } as emojiObj);
        });
        setEmojis(list);
        console.log(list);
      },
      error => {
        console.log(error);
      }
    );
  }, []);

  return <div></div>;
};

export default Emoji;
