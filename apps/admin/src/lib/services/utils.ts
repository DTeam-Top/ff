import { writable } from "svelte/store";

export const signed = writable();
export const removeItem = (key: string, window: any) => {
  signed.set(false);
  window.localStorage.removeItem(key);
};

export const getItem = (key: string, window: any) => {
  const item = window.localStorage.getItem(key);
  //   signed.set(!!item);
  //   setContext("signed", signed);
  signed.set(!!item);
  return item ? JSON.parse(item) : null;
};

export const setItem = (key: string, window: any, data: any) => {
  signed.set(true);
  window.localStorage.setItem(key, data);
};
