import Fire from "../firebase/Fire"
import { emailToKey } from "./emailKeyConvert";

export const handleBlockUser = async (blockingEmail, blockedEmail) => {
  const userKey = emailToKey(blockingEmail);

  if (!(blockedEmail && blockingEmail))
    return;

  const listBlocked = Object.values((await Fire.get(`user/${userKey}/blockedUsers`)) ?? {});

  if (!listBlocked.includes(blockedEmail))
    listBlocked.push(blockedEmail);

  await Fire.set(`user/${userKey}/blockedUsers`, listBlocked)
}

export const handleUnblockUser = async (blockingEmail, blockedEmail) => {
  const userKey = emailToKey(blockingEmail);

  if (!(blockedEmail && blockingEmail))
    return;

  let listBlocked = Object.values((await Fire.get(`user/${userKey}/blockedUsers`)) ?? {});

  if (listBlocked.includes(blockedEmail))
    listBlocked = listBlocked.filter(email => email !== blockedEmail);

  await Fire.set(`user/${userKey}/blockedUsers`, listBlocked)
}