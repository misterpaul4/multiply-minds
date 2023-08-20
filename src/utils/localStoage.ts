export const setLS = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getLs = (key: string) => {
  const data = localStorage.getItem(key);

  if (data === undefined) {
    return undefined;
  }

  return JSON.parse(data as string);
};

