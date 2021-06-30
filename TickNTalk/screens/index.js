import ScreenEditUserInfo from "./ScreenEditUserInfo";
import ScreenMaster from "./ScreenMaster";
import ScreenConversations from "./ScreenConversations";
import ScreenMyProfile from "./ScreenMyProfile";
import ScreenSignIn from "./ScreenSignIn";
import ScreenSignUp from "./ScreenSignUp";
import ScreenStartUp from "./ScreenStartUp";
import ScreenEditUserPassword from "./ScreenEditUserPassword";
import ScreenMessage from "./ScreenMessage";
import ScreenCreateConversation from "./ScreenCreateConversation";
import ScreenConversationInfo from "./ScreenConversationInfo";
import ScreenResetPassword from "./ScreenResetPassword";
// [ADD NEW SCREEN]

export const MASTER_TAB_SCREENS = {
  conversations: {
    name: "Conversations",
    screen: ScreenConversations,
    title: "Conversations",
  },

  myProfile: {
    name: "MyProfile",
    screen: ScreenMyProfile,
    title: "Profile",
  },
};

export const SCREENS = {
  startUp: {
    name: "StartUp",
    screen: ScreenStartUp,
  },

  signIn: {
    name: "SignIn",
    screen: ScreenSignIn,
  },

  signUp: {
    name: "SignUp",
    screen: ScreenSignUp,
  },

  master: {
    name: "Master",
    screen: ScreenMaster,
  },

  editUserInfo: {
    name: "EditUserInfo",
    screen: ScreenEditUserInfo,
  },

  editUserPassword: {
    name: "EditUserPassword",
    screen: ScreenEditUserPassword,
  },

  message: {
    name: "Message",
    screen: ScreenMessage,
  },

  createConversation: {
    name: "CreateConversation",
    screen: ScreenCreateConversation,
  },

  conversationInfo: {
    name: "ConversationInfo",
    screen: ScreenConversationInfo,
  },
  
  resetPassword: {
    name: "ResetPassword",
    screen: ScreenResetPassword,
  },

  ...MASTER_TAB_SCREENS,
};
