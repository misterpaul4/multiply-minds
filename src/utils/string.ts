export const toTitleCase = (inputString: string) => {
  return inputString.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};

