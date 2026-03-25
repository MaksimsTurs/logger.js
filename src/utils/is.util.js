import { access } from "node:fs/promises";
import { existsSync } from "node:fs";

/**
 *  @param {string} path
 *  @returns {Promise<boolean>}
 */
export async function isPathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
/**
 *  @param {string} path
 *  @returns {boolean}
 */
export function isPathExistsSync(path) {
  return existsSync(path); 
};
/**
 *  @param {string} ch
 *  @returns {boolean}
 */
export const isAlphabetic = (ch) => (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
/**
 *  @param {any} something
 *  @returns {something is Record<string>}
 */
export const isObject = (something) => typeof something === "object" && !Array.isArray(something) && something !== null;
/**
 *  @param {any} something
 *  @returns {something is any[]}
 */
export const isArray = (something) => Array.isArray(something);
