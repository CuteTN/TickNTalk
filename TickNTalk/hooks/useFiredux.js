import { useSelector } from 'react-redux';
import Fire from '../firebase/Fire';

const subscribedPaths = {}

/**
 * @param {AvailableFirebaseChildren} path 
 */
export const useFiredux = (path) => {
  if (path) {
    if (!subscribedPaths[path]) {
      subscribedPaths[path] = true;
      Fire.subscribeReduxRef(path);
    }

    return useSelector(state => state?.reducerFirebase?.[path]);
  }
  else
    return null;
}

/**
 * @typedef {"user"|"conversation"|"privateMessage"} AvailableFirebaseChildren
 */