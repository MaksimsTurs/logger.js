import { access } from "node:fs/promises";

export async function isItemExist(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch(_err) {
    return false;
  }
};

export const isAlphabetic = (ch: string): boolean => (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");

export const isObject = (something: any): something is object => typeof something === "object" && !Array.isArray(something);
