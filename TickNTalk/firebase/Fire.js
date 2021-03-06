import firebase from "firebase";
import { reduxStore } from "../redux/store";
import { createActionUpdateFirebase } from "../redux/actions/CreateActionUpdateFirebase";
import * as log from "../Utils/ConsoleLog";
import { firebaseConfig } from "./FirebaseConfig";
import { validateEmail } from "../Utils/FieldsValidating";
import { emailToKey } from "../Utils/emailKeyConvert";

class Fire {
  static init = (deviceToken) => {
    Fire.deviceToken = deviceToken;
    Fire.initApp();
  };
  static deviceToken = null;
  static initApp = () => {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    else firebase.app();
  };

  static auth = () => firebase.auth();

  static subscribeStorage = () => firebase.storage().ref();

  static getCurrentUser = () => {
    return firebase.auth().currentUser;
  };

  static signOut = async () => {
    let successful = false;
    let errorMessage = undefined;

    await firebase
      .auth()
      .signOut()
      .then(
        () => {
          log.logSuccess(`Signed out successfully`);
          successful = true;
        },
        (error) => {
          console.error(error);
          errorMessage = error;
        }
      );

    return { successful, errorMessage };
  };

  static resetPassword = async (email) => {
    let successful = false;
    let errorMessage = undefined;
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function (user) {
        log.logSuccess(`Send password reset to email successfully`);
        successful = true;
      })
      .catch(function (error) {
        console.error(error);
        errorMessage = error;
      });
    return { successful, errorMessage };
  };

  static checkInputPasswordMatched = async (currentPassword) => {
    let user = firebase.auth().currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return await user.reauthenticateWithCredential(cred);
  };

  static signUpWithEmail = async (email, password) => {
    let successful = false;
    let errorMessage = undefined;
    email = email.toLowerCase();

    if (!validateEmail(email)) log.logError(`${email} is an invalid email`);

    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          (credential) => {
            log.logSuccess(`Created new user with email: ${email}`);
            Fire.update(`user/${emailToKey(email)}`, {
              email,
              displayName: email,
            });
            successful = true;
          },
          (error) => {
            console.error(error);
            errorMessage = error;
          }
        );
    } catch (error) {
      console.error(error);
      errorMessage = error;
    }

    return { successful, errorMessage };
  };

  static signInWithEmail = async (email, password) => {
    let successful = false;
    let errorMessage = undefined;
    email = email.toLowerCase();

    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          (credential) => {
            log.logSuccess(`user ${email} signed in successfully`);
            successful = true;
          },
          (error) => {
            console.error(error);
            errorMessage = error;
          }
        );
    } catch (error) {
      console.error(error);
      errorMessage = error;
    }

    return { successful, errorMessage };
  };

  static getRootRef = () => firebase.database().ref();

  /// name: name of table from the root
  /// retouch: obj => obj: apply some change to the array of db before storing it to redux
  static subscribeReduxRef = (refPath, retouch) => {
    let ref = firebase.database().ref().child(refPath);
    log.logInfo(`Subscribed to Firebase/${refPath}`, false, false);

    ref.on(
      "value",
      (snapshot) => {
        let obj = snapshot.toJSON();

        if (retouch && typeof retouch === "function") obj = retouch(obj);

        // update to redux
        reduxStore.dispatch(createActionUpdateFirebase(refPath, obj));
        log.logSuccess(
          `Collection ${refPath} has been retrieved and updated globaly!`
        );
      },
      (error) => {
        log.logError(`Failed to retrieve collection ${refPath}: ${error}`);
      }
    );
  };

  static getRootRef = () => firebase.database().ref();

  static unsubscribeReduxRef = (refPath) => {
    let ref = firebase.database().ref().child(refPath);
    log.logInfo(`Unsubscribed to Firebase/${refPath}`, false, false);
    ref.off("value");
  };

  static get = async (refPath) => {
    let ref = firebase.database().ref().child(refPath);
    const item = await ref.get().catch((error) => {
      log.logError(`Could not find item from ${refPath}:\nError: ${error}`);
    });
    return item?.toJSON();
  };

  // push a new item to refPath (i.e value would be in child ref of refPath). auto generate new ID.
  static push = async (refPath, value) => {
    let ref = firebase.database().ref().child(refPath);

    try {
      const link = await ref.push(value);

      log.logSuccess(`New item was added successfully at ${refPath}: ${link}`);

      return link;
    } catch (error) {
      log.logError(
        `Could not add new item to ${refPath}:\n${value}\nError: ${error}`
      );

      return null;
    }
  };

  // set refPath new value, remove all old values
  static set = async (refPath, value) => {
    let ref = firebase.database().ref().child(refPath);
    let link = ref.set(value).then(
      (value) => log.logSuccess(`Item was set successfully at ${refPath}`),
      (error) =>
        log.logError(
          `Could not set value to ${refPath}:\n${value}\nError: ${error}`
        )
    );
    return link;
  };

  // update refPath new value, keep and override old values
  static update = async (refPath, value) => {
    let ref = firebase.database().ref().child(refPath);
    let link = ref.update(value).then(
      (value) => log.logSuccess(`Item was updated successfully at ${refPath}`),
      (error) =>
        log.logError(
          `Could not update value to ${refPath}:\n${value}\nError: ${error}`
        )
    );
    return link;
  };

  static remove = async (refPath) => {
    let ref = firebase.database().ref().child(refPath);
    let link = ref.remove().then(
      (value) => log.logSuccess(`Item was removed successfully at ${refPath}`),
      (error) =>
        log.logError(
          `Could not remove item from ${refPath}:\n${value}\nError: ${error}`
        )
    );
    return link;
  };
}

export default Fire;
