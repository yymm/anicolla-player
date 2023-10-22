// @ts-ignore
export const jsonFetcher = (...args) =>
  // @ts-ignore
  fetch(...args).then((res) => res.json());
