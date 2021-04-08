import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Text } from "react-native"
import { connectFirebase } from "../redux/connectors/ConnectFirebase"
import { connectLoggedIn } from "../redux/connectors/ConnectLoggedIn"
import { logDebug } from '../Utils/ConsoleLog';

const Item = ({ item, onPress, backgroundColor, textColor }) => {
    const userName = item?._value?.userName
    logDebug("UserName: " + userName)

    return (
        <TouchableOpacity onPress={onPress} style={[backgroundColor]}>
            <Text style={[textColor]}>{userName}</Text>
        </TouchableOpacity>
    )
}

const TestFirebaseLoaded = (props) => {
    const [selectedId, setSelectedId] = useState(null);
    logDebug(JSON.stringify(props.db.user)) // connected to redux firebase reducer
    logDebug(JSON.stringify(props.isLoggedIn)) // connected to redux loggedIn reducer

    const renderItem = ({item}) => {
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
        <FlatList
            data = {props.db.user}
            renderItem = {renderItem} 
        />
    )
}

export default connectFirebase(connectLoggedIn(TestFirebaseLoaded))