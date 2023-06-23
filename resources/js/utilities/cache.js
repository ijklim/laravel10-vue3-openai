export const cache = {
  get: (key, defaultValue = null) => {
    return localStorage.getItem(key) || defaultValue;
  },
  store: (key, value) => {
    localStorage.setItem(key, value);
  },
};
