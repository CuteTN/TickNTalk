import React, { useEffect, useState, useRef } from 'react';
import Fire from '../firebase/Fire';
import { emailToKey } from '../Utils/emailKeyConvert';
import { checkEnoughUserInfo } from '../Utils/FieldsValidating';

/** @typedef {"Unknown"|"SignedIn"|"NotSignedIn"|"NoInfo"} StatusType */

/**
 * Get/Set current user info
 * @returns {{user: any, updateUser: (newValue: any) => void, status: StatusType}}
 */
export const useSignedIn = () => {
  // const { email } = useSelector(state => state.reducerSignedIn, shallowEqual);
  const [email, setEmail] = useState(null);
  const [user, setUser] = useState(null);

  /** @type [StatusType, React.Dispatch<React.SetStateAction<StatusType>>] */
  const [status, setStatus] = useState("Unknown");

  // subscribe to auth change
  useEffect(() => {
    const changeUserUnlistener = Fire.auth().onAuthStateChanged(newUser => {
      setEmail(newUser?.email);
      if (!newUser) {
        setUser(null);
        setStatus("NotSignedIn");
      }
    })

    return changeUserUnlistener;
  }, []);

  // subscribe to user info update
  useEffect(() => {
    const userId = emailToKey(email);
    const childRef = Fire.getRootRef().child(`user/${userId}`);
    const updateUserListener = childRef.on("value", (snapshot) => {
      setUser(snapshot.toJSON());
    })

    return () => {
      childRef.off("value", updateUserListener);
    }
  }, [email]);


  useEffect(() => {
    if (user)
      setStatus(checkEnoughUserInfo(user).isValid ? "SignedIn" : "NoInfo");
  }, user)


  const updateUser = (newValue) => {
    if (email) {
      const userId = emailToKey(email);
      Fire.update(`user/${userId}`, newValue);
    }
  }

  return { user, updateUser, status }
}