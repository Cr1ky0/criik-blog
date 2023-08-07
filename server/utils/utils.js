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

module.exports = { truncateString };
