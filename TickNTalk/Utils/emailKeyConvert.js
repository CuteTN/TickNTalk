/**
 * @param {string} key 
 */
export const keyToEmail = (key) => key?.replace('^', '.');

/**
 * @param {string} email
 */
export const emailToKey = (email) => email?.replace('.', '^');