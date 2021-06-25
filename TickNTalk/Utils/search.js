import { emailToKey } from "./emailKeyConvert";

/**
 * @param {string} text 
 * @param {string} targetString 
 * @returns {number} returns -1 if it doesn't match 
 */
const matchPointString = (text, targetString) => {
  if ((!text) || (!targetString))
    return -1;

  targetString = targetString.toLowerCase();

  const words = text.toLowerCase().split(" ");
  let result = 0;

  words.forEach(word => {
    result += targetString.includes(word) ? word.length : 0;
  });

  return result;
}

/**
 * @param {string} text 
 * @param {object} targetUser 
 * @returns {number} returns -1 if it doesn't match 
 */
export const matchPointUser = (text, targetUser) => {
  if ((!text) || (!targetUser))
    return -1;

  return [
    targetUser.firstName + targetUser.lastName,
    targetUser.displayName,
    targetUser.email,
    targetUser.phoneNumber,
  ]
    .map((str) => matchPointString(text, str))
    .reduce((a, b) => Math.max(a, b));
}

/**
 * @param {string} text 
 * @param {object} targetConversation 
 * @param {object} users expected raw users object
 */
export const matchPointConversation = (text, targetConversation, users) => {
  if ((!text) || (!targetConversation))
    return -1;

  const listMembers = Object.values(targetConversation.listMembers);

  const matchPointMembers = !users ?
    -1
    :
    listMembers
      ?.map(emailToKey) // email to key
      ?.map(key => users[key]) // key to user
      ?.map(user => matchPointUser(text, user)) // user to matchpoint
      .reduce((a, b) => Math.max(a, b));

  const matchPointInfo = [
    targetConversation.name,
  ]
    .map((str) => matchPointString(text, str))
    .reduce((a, b) => Math.max(a, b));

  return Math.max(matchPointInfo, matchPointMembers);
}
