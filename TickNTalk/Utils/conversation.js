/**
 * @param {string} email 
 * @param {{ listSeenMembers: []? }} conversaton 
 */
export const checkConversationSeenByUser = (email, conversaton) => {
  return Object.values(conversaton?.listSeenMembers ?? {})?.includes(email);
}

/**
 * @param {string} email 
 * @param {{ listMembers: []? }} conversaton 
 */
export const checkConversationHasUser = (email, conversaton) => {
  return Object.values(conversaton?.listMembers ?? {})?.includes(email);
}