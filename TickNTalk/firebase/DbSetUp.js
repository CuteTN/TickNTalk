import Fire from "./Fire";

export const dbSetUp = () => {
    Fire.subscribeReduxRef("user")
    Fire.subscribeReduxRef("room")
}