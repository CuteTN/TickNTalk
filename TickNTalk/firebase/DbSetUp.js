import Fire from "./Fire";

export const dbSetUp = () => {
    Fire.subscribeRef("user")
    Fire.subscribeRef("room")
}