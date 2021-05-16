import firebase from 'firebase'
import { reduxStore } from '../redux/store';
import { createActionUpdateFirebase } from '../redux/actions/CreateActionUpdateFirebase'
import * as log from '../Utils/ConsoleLog';
import { firebaseConfig } from './FirebaseConfig';
import { validateEmail } from '../Utils/FieldsValidating';

class Fire {
    static initApp = () => {
        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);
        else
            firebase.app();
    };

    static getCurrentUser = () => {
        return firebase.auth().currentUser
    }

    static signOut = async () => {
        let result = false
        await firebase.auth().signOut().then(
            () => {
                log.logSuccess(`Signed out successfully`)
                result = true
            },
            (error) => {
                log.logError(`Sign out error: `, false, false)
                log.logError(error)
            }
        )

        return result;
    }

    static signUpWithEmail = async (email, password) => {
        let result = false
        email = email.toLowerCase();

        if (!validateEmail(email))
            log.logError(`${email} is an invalid email`)

        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then(
                (credential) => {
                    log.logSuccess(`Created new user with email: ${email}`);
                    Fire.update(`user/${email.replace('.', '_')}`, {
                        email,
                        displayName: email,
                    })
                    result = true;
                },
                (error) => {
                    log.logError(`Sign up error: `, false, false)
                    log.logError(error)
                }
            );
        }
        catch (error) {
            log.logError(`Sign up error: `, false, false)
            log.logError(error)
        }

        return result
    }

    static signInWithEmail = async (email, password) => {
        let result = false
        email = email.toLowerCase();

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then(
                (credential) => {
                    log.logSuccess(`user ${email} signed in successfully`)
                    result = true
                },
                (error) => {
                    log.logError(`Sign in error: `, false, false)
                    log.logError(error)
                }
            );
        }
        catch (error) {
            log.logError(`Sign in error: `, false, false)
            log.logError(error)
        }

        return result
    }

    static init = () => {
        Fire.initApp();
        // this.checkAuth();
    };

    static getRootRef = () => firebase.database().ref()

    static checkAuth = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
        })
    };

    /// name: name of table from the root
    /// retouch: arr => arr: apply some change to the array of db before storing it to redux
    static subscribeRef = (refPath, retouch) => {
        let ref = firebase.database().ref().child(refPath);
        log.logInfo(`Subscribed to Firebase/${refPath}`, false, false)

        ref.on("value",
            (snapshot) => {
                let list = [];

                snapshot.forEach((child) => {
                    let item = {
                        _key: child.key,
                        _value: child.toJSON()
                    }

                    list.push(item);
                })

                if (retouch && typeof retouch === "function")
                    list = retouch(list)

                // update to redux
                reduxStore.dispatch(createActionUpdateFirebase(refPath, list));
                log.logSuccess(`Collection ${refPath} has been retrieved and updated globaly!`)
            },
            (error) => { log.logError(`Failed to retrieve collection ${refPath}: ${error}`) }
        )
    }

    static unSubscribeRef = (refPath) => {
        let ref = firebase.database().ref().child(refPath);
        log.logInfo(`Unsubscribed to Firebase/${refPath}`, false, false)
        ref.off("value")
    }

    static get = async (refPath) => {
        let ref = firebase.database().ref().child(refPath)
        const item = await ref.get().catch((error) => {
            log.logError(`Could not find item from ${refPath}:\nError: ${error}`)
        })
        return item
    }

    // push a new item to refPath (i.e value would be in child ref of refPath). auto generate new ID.
    static push = async (refPath, value) => {
        let ref = firebase.database().ref().child(refPath)
        const link = await ref.push(value).then(
            (value) => log.logSuccess(`New item was added successfully at ${refPath}: ${value}`),
            (error) => log.logError(`Could not add new item to ${refPath}:\n${value}\nError: ${error}`)
        )
        return link
    }

    // set refPath new value, remove all old values
    static set = async (refPath, value) => {
        let ref = firebase.database().ref().child(refPath)
        let link = ref.set(value).then(
            (value) => log.logSuccess(`Item was set successfully at ${refPath}`),
            (error) => log.logError(`Could not set value to ${refPath}:\n${value}\nError: ${error}`)
        )
        return link
    }

    // update refPath new value, keep and override old values
    static update = async (refPath, value) => {
        let ref = firebase.database().ref().child(refPath)
        let link = ref.update(value).then(
            (value) => log.logSuccess(`Item was updated successfully at ${refPath}`),
            (error) => log.logError(`Could not update value to ${refPath}:\n${value}\nError: ${error}`)
        )
        return link
    }

    static remove = async (refPath) => {
        let ref = firebase.database().ref().child(refPath)
        let link = ref.remove().then(
            (value) => log.logSuccess(`Item was removed successfully at ${refPath}`),
            (error) => log.logError(`Could not remove item from ${refPath}:\n${value}\nError: ${error}`)
        )
        return link
    }

}

Fire.init()
export default Fire