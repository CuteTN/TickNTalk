import React from "react";
import { Image } from 'react-native'

export const BasicImage = ({ style, icon, borderRadius, source }) => {
  return (
    <Image
      style={[
        {
          width: icon,
          height: icon,
          alignItems: "center",
          justifyContent: "center",
          borderRadius,
        },
        style,
      ]}
      source={source}
    />
  );
};