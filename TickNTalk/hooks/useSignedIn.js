import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Fire from '../firebase/Fire';
import { emailToKey } from '../Utils/emailKeyConvert';

/**
 * Get/Set current user info
 * @returns {{user: any, updateUser: (newValue: any) => void}}
 */
export const useSignedIn = () => {
  const { email } = useSelector(state => state.reducerSignedIn);
  const [user, setUser] = useState()

  const userId = emailToKey(email);

  useEffect(() => {
    const childRef = Fire.getRootRef().child(`user/${userId}`);

    const listener = childRef.on("value", (snapshot) => {
      setUser(snapshot.toJSON());
    })

    return () => {
      childRef.off("value", listener);
    }
  }, []);

  const updateUser = (newValue) => {
    if (email)
      Fire.update(`user/${userId}`, newValue);
  }

  return { user, updateUser }
}