import { replaceAll } from "./stringUtils";

/**
 * @param {string} key
 */
export const keyToEmail = (key) => replaceAll(key, "^", ".");

/**
 * @param {string} email
 */
export const emailToKey = (email) => replaceAll(email, ".", "^");

export const tokenToKey = (token) => replaceAll(replaceAll(token, "[", "^"), "]", "&");

export const keyToToken = (key) => replaceAll(replaceAll(key, "^", "["), "&", "]");
