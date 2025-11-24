const capitalizeWord = (word: string) => {
  if (!word) return "UNKNOWN";
  return word.toUpperCase();
};

export default capitalizeWord;
