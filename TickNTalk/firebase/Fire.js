import firebase from 'firebase'
import reduxStore from '../redux/store';
import createUpdateFirebaseAction from '../redux/actions/CreateUpdateFirebaseAction'

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
    /// comparer: sometimes you want to sort data once you fetch it home, pass a function to compare 2 item is provided
    static subscribeRef = (name, comparer = null) => {
        let ref = Fire.db.child(name);
        Fire[name + "Ref"] = ref;

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

                if(comparer)
                    list.sort(comparer);

                // update to redux
                reduxStore.dispatch(createUpdateFirebaseAction(name, list));
                // console.log(`${name} updated!`);
            },
            (error) => {console.log(error)}
        )
    }
}

Fire.init();
// Fire.initApp();
Fire.subscribeRef("message");
Fire.subscribeRef("user");

export default Fire;