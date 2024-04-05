export const objectToQueryString = (obj: Record<string, unknown>) => {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key] as string))
    .join('&');
};
