/**
 * @param {string} key
 */
export const keyToEmail = (key) => key?.replace("^", ".");

/**
 * @param {string} email
 */
export const emailToKey = (email) => email?.replace(".", "^");

export const tokenToKey = (token) => token?.replace("[", "^").replace("]", "&");

export const keyToToken = (key) => key?.replace("^", "[").replace("&", "]");
