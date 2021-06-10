import React, { useEffect, useState, useRef } from 'react';
import Fire from '../firebase/Fire';
import { emailToKey } from '../Utils/emailKeyConvert';

/**
 * Get/Set current user info
 * @returns {{user: any, updateUser: (newValue: any) => void, status: "Unknown"|"SignedIn"|"NotSignedIn"}}
 */
export const useSignedIn = () => {
  // const { email } = useSelector(state => state.reducerSignedIn, shallowEqual);
  const [email, setEmail] = useState(null);
  const [user, setUser] = useState(null);

  /** @type ["Unknown"|"SignedIn"|"NotSignedIn", React.Dispatch<React.SetStateAction<"Unknown"|"SignedIn"|"NotSignedIn">>] */
  const [status, setStatus] = useState("Unknown");

  // subscribe to auth change
  useEffect(() => {
    const changeUserUnlistener = Fire.auth().onAuthStateChanged(newUser => {
      setEmail(newUser?.email);
      setStatus(newUser ? "SignedIn" : "NotSignedIn")
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


  const updateUser = (newValue) => {
    if (email) {
      const userId = emailToKey(email);
      Fire.update(`user/${userId}`, newValue);
    }
  }

  return { user, updateUser, status }
}