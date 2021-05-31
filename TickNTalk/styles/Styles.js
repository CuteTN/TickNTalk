import { StyleService } from "@ui-kitten/components";

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
    }
});