import ScreenEditUserInfo from './ScreenEditUserInfo'
import ScreenMaster from './ScreenMaster'
import ScreenConversations from './ScreenConversations'
import ScreenMyProfile from './ScreenMyProfile'
import ScreenSignIn from './ScreenSignIn'
import ScreenSignUp from './ScreenSignUp'
import ScreenStartUp from './ScreenStartUp'
import ScreenEditUserAva from './ScreenEditUserAva'
import ScreenMessage from './ScreenMessage'
// [ADD NEW SCREEN]

export const MASTER_TAB_SCREENS = {
  conversations: {
    name: "Conversations",
    screen: ScreenConversations,
  },


  myProfile: {
    name: "MyProfile",
    screen: ScreenMyProfile,
  },
}

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

  editUserAva:{
    name: "EditUserAva",
    screen: ScreenEditUserAva,
  },

  message:{
    name:"Message",
    screen: ScreenMessage,
  },
  ...MASTER_TAB_SCREENS,
}