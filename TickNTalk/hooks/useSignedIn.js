import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Fire from '../firebase/Fire';
import { emailToKey } from '../Utils/emailKeyConvert';

/**
 * Get/Set current user info
 * WARNING: This won't track the change of redux data itself. Yet I don't even know why :)
 * @returns {{email: string, user: any, updateUser: (newValue: any) => void}}
 */
export const useSignedIn = () => {
  const { email } = useSelector(state => state.reducerSignedIn, shallowEqual);
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