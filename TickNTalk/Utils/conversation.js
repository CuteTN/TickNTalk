import Fire from "../firebase/Fire";

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

export const handleSeenByUser = async (email, conversationId, conversation) => {
  const listSeenMembers = Object.values(conversation?.listSeenMembers ?? {});

  if (!listSeenMembers.includes(email)) {
    listSeenMembers.push(email);
    await Fire.update(`conversation/${conversationId}/`, { listSeenMembers });
  }
};

export const handleUnseenByUser = async (email, conversationId, conversation) => {
  let listSeenMembers = Object.values(conversation?.listSeenMembers ?? {});

  if (listSeenMembers.includes(email)) {
    listSeenMembers = listSeenMembers.filter(e => e !== email)
    await Fire.update(`conversation/${conversationId}/`, { listSeenMembers });
  }
};

/**
 * Useful when you don't want to include signed in account in the list of members 
 * @param {string} email Email to exclude
 * @param {string} conversation Expected raw conversation object
 * @returns {[string]} a list of other's emails
 */
export const getOtherUsersInConversation = (email, conversation) => {
  return Object.values(conversation?.listMembers ?? {}).filter(e => email !== e);
}