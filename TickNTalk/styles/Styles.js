import { StyleService } from "@ui-kitten/components";
import {Dimensions} from 'react-native'
 const windowWidth = Dimensions.get("window").width;
 const windowHeight = Dimensions.get("window").height;

//UNIVERSAL SIZE UNIT
export const sizeFactor = windowWidth / 25.7;

export const Styles = StyleService.create({
    overall: {
        marginHorizontal: 16,
        marginVertical: 8,
    },

    button: {
        width: 128,
        borderRadius: 8,
    },

    outerLayout: {
        marginHorizontal: 16,
        marginVertical: 16,
    },

    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        alignSelf: "stretch",
    },
    MessageCard: {
        paddingTop: sizeFactor * 0.25,
        paddingBottom: sizeFactor * 0.25,
        paddingHorizontal: sizeFactor,
        width: windowWidth,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
});