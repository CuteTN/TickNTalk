import firebase from 'firebase'
import { reduxStore } from '../redux/store';
import { createActionUpdateFirebase } from '../redux/actions/CreateActionUpdateFirebase'
import * as log from '../Utils/ConsoleLog';

class Fire {
    db = null;

    static initApp = () => {
        if (!firebase.apps.length) 
            firebase.initializeApp(Fire.firebaseConfig);
        else
            firebase.app();
    };

    static init = () => {
        Fire.initApp();
        // this.checkAuth();
        Fire.db = firebase.database().ref();
    };    

    static firebaseConfig = {
        apiKey: "AIzaSyDce4VCJ5k9YTfARNVcGwY7X-G-bsiygYM",
        authDomain: "tickntalk2.firebaseapp.com",
        projectId: "tickntalk2",
        storageBucket: "tickntalk2.appspot.com",
        messagingSenderId: "388687038613",
        appId: "1:388687038613:web:cbd08be62a14fd97b5f39c",
        measurementId: "G-7G41Y92FYW"
    };

    static checkAuth = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
        })
    };

    /// name: name of table from the root
    /// retouch: arr => arr: apply some change to the array of db before storing it to redux
    static subscribeRef = (name, retouch) => {
        let ref = Fire.db.child(name);
        log.logInfo(`Listening to Firebase/${name}`, false, false)

        ref.on("value", 
            (snapshot) => {
                let list = [];

                snapshot.forEach((child) => {
                    let item = {
                        _key : child.key,
                        _value : child.toJSON()
                    }

                    list.push(item);
                })

                if(retouch && typeof retouch === "function")
                    list = retouch(list)

                // update to redux
                reduxStore.dispatch(createActionUpdateFirebase(name, list));
                log.logSuccess(`Collection ${name} has been retrieved and updated globaly!`)
            },
            (error) => {log.logError(`Failed to retrieve collection ${name}: ${error}`)}
        )
    }
}

Fire.init()
export default Fire