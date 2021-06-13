import { useEffect, useState } from "react";
import Fire from "../firebase/Fire";

/**
 * @param {...string} path 
 * @returns {[object, {push: ApiFunction, set: ApiFunction, update: ApiFunction, remove: () => object}]} Returns an array, first element is data, second one is apis
 */
export const useRealtimeFire = (...path) => {
  const [data, setData] = useState(null)
  const isPathError = path.some(s => !Boolean(s));
  const fullPath = path.reduce((a, b) => a + "/" + b);

  useEffect(() => {
    const childRef = Fire.getRootRef().child(fullPath);

    const listener = childRef.on('value', snapshot => {
      setData?.(snapshot?.toJSON?.());
    })

    return () => {
      Fire.getRootRef().off('value', listener);
    }
  }, [fullPath])

  const api = {
    push: isPathError ? EMPTY_FUNCTION : async (value) => Fire.push(fullPath, value),
    set: isPathError ? EMPTY_FUNCTION : async (value) => Fire.set(fullPath, value),
    update: isPathError ? EMPTY_FUNCTION : async (value) => Fire.update(fullPath, value),
    remove: isPathError ? EMPTY_FUNCTION : async () => Fire.remove(fullPath),
  }


  return isPathError ?
    [null, api]
    :
    [data, api]
}

const EMPTY_FUNCTION = async () => { new Promise() }
/** @typedef {(value: object) => any} ApiFunction */