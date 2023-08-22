const truncateString = (str, index, maxLength, maxTotalLength) => {
  if (str.length <= maxTotalLength) {
    return str;
  }

  const startIndex = Math.max(0, index - maxLength);
  const endIndex = Math.min(str.length, index + maxLength);

  let truncatedString = str.substring(startIndex, endIndex);

  if (startIndex > 0) {
    truncatedString = `...${truncatedString}`;
  }

  if (endIndex < str.length) {
    truncatedString += '...';
  }

  return truncatedString;
};

// 获取菜单最大深度
const getMaxDepth = (menu) => {
  let maxDepth = 1;
  const child = menu.children;
  if (child) {
    for (let i = 0; i < child.length; i += 1) {
      if (maxDepth < 2) maxDepth = 2;
      const grand = child[i].children;
      if (grand) {
        for (let j = 0; j < grand.length; j += 1) {
          if (maxDepth < 3) maxDepth = 3;
        }
      }
    }
  }
  return maxDepth;
};

module.exports = { truncateString, getMaxDepth };
