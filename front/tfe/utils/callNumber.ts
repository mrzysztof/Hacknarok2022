import * as Linking from "expo-linking";
import { Platform } from "react-native";
export const callNumber = (phone: string) => {
  let phoneNumber = phone;
  if (Platform.OS !== "android") {
    phoneNumber = `telprompt:+${phone}`;
  } else {
    phoneNumber = `tel:+${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
        console.log(supported)
      // Could not get it to support the call, so i commented it out
      // if (!supported) {
      //     Alert.alert('Phone number is not available');
      // } else {
      return Linking.openURL(phoneNumber);
      // }
    })
    .catch((err) => console.log(err));
};
