import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Text, SafeAreaView, Button } from "react-native"
import Fire from '../firebase/Fire';
import { logDebug, logError, logInfo, logWarning } from '../Utils/ConsoleLog';
import { connectFirebase } from '../redux/connectors/ConnectFirebase'

const Item = ({ item, onPress, backgroundColor, textColor }) => {
    const userName = item?._value?.userName
    logDebug("UserName: " + userName)

    return (
        <TouchableOpacity onPress={onPress} style={[backgroundColor]}>
            <Text style={[textColor]}>{userName}</Text>
        </TouchableOpacity>
    )
}

const handleTestLogClick = () => {
    logWarning("Thao cuteeeeee", false, false)
}

const handleTestPushClick = () => {
    Fire.push("user", { userName: "push co dao Chun" })
}

const handleTestAddZClick = () => {
    Fire.set("user/z", { userName: "add In cute" })
    Fire.set("user/z/z/z/z", { "z": "z" })
}

const handleTestSetClick = () => {
    Fire.set("user/a", { userName: "set Chun cute" })
}

const handleTestUpdateClick = () => {
    Fire.update("user/a", { updatedAt: Date.now() })
}

const handleTestDeleteClick = () => {
    Fire.remove("user/z")
}

const TestFirebaseLoaded = ({ db, isSignedIn }) => {
    const [selectedId, setSelectedId] = useState(null);
    logDebug(JSON.stringify(db), true, true)
    logDebug(JSON.stringify(db.user)) // connected to redux firebase reducer
    logDebug(JSON.stringify(isSignedIn)) // connected to redux signedIn reducer

    const renderItem = ({ item }) => {
        // logDebug(JSON.stringify(item))
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    return (
        <SafeAreaView style={{ margin: 50, backgroundColor: "hotpink" }}>
            {/* <Button title="filler button" disabled={true}/>
            <Button title="filler button" disabled={true}/>
            <Button title="filler button" disabled={true}/> */}
            <FlatList
                style={{ marginTop: 100 }}
                data={db.user}
                renderItem={renderItem}
            />
            <Button title="test log" onPress={handleTestLogClick} />
            <Button title="test Push" onPress={handleTestPushClick} />
            <Button title="test Add z" onPress={handleTestAddZClick} />
            <Button title="test Set" onPress={handleTestSetClick} />
            <Button title="test Update" onPress={handleTestUpdateClick} />
            <Button title="test Delete" onPress={handleTestDeleteClick} />
        </SafeAreaView>
    )
}

export default connectFirebase(TestFirebaseLoaded)