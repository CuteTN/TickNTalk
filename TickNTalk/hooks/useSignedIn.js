import React, { useEffect, useState, useRef } from "react";
import Fire from "../firebase/Fire";
import { emailToKey, tokenToKey } from "../Utils/emailKeyConvert";
import { checkEnoughUserInfo } from "../Utils/FieldsValidating";
import { registerForPushNotificationsAsync } from "../Utils/PushNoti";
import * as Notifications from 'expo-notifications'
/** @typedef {"Unknown"|"SignedIn"|"NotSignedIn"|"NoInfo"} StatusType */

/**
 * Get/Set current user info
 * @returns {{user: any, updateUser: (newValue: any) => void, status: StatusType}}
 */
export const useSignedIn = () => {
  // const { email } = useSelector(state => state.reducerSignedIn, shallowEqual);
  const [email, setEmail] = useState(null);
  const preEmail = useRef(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  /** @type [StatusType, React.Dispatch<React.SetStateAction<StatusType>>] */
  const [status, setStatus] = useState("Unknown");

  // subscribe to auth change
  useEffect(() => {
    const changeUserUnlistener = Fire.auth().onAuthStateChanged((newUser) => {
      preEmail.current = email;
      setEmail(newUser?.email);
      if (!newUser) {
        setUser(null);
        setStatus("NotSignedIn");
      } else {
      }
    });

    return changeUserUnlistener;
  }, []);
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setToken(token);
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  useEffect(() => {
    if (token) {
      console.log(tokenToKey(token));
      if (email)
        Fire.update(`user/${emailToKey(email)}/tokens/${tokenToKey(token)}`, {
          isAvailable: true,
        });
      else
        Fire.remove(
          `user/${emailToKey(preEmail.current)}/tokens/${tokenToKey(token)}`
        );
    }
  }, [token, email]);

  // subscribe to user info update
  useEffect(() => {
    const userId = emailToKey(email);
    const childRef = Fire.getRootRef().child(`user/${userId}`);
    const updateUserListener = childRef.on("value", (snapshot) => {
      setUser(snapshot.toJSON());
    });

    return () => {
      childRef.off("value", updateUserListener);
    };
  }, [email]);

  useEffect(() => {
    if (user)
      setStatus(checkEnoughUserInfo(user).isValid ? "SignedIn" : "NoInfo");
  }, user);

  const updateUser = (newValue) => {
    if (email) {
      const userId = emailToKey(email);
      Fire.update(`user/${userId}`, newValue);
    }
  };

  return { user, updateUser, status };
};
