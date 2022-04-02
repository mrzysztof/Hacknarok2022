import React, { useContext } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Button } from "../../components";
import { userContext } from "../../context";

export const Login: React.FC = () => {
  const { login } = useContext(userContext);

  return (
    <SafeAreaView>
      <View>
        <Text>Login page</Text>
        <Button label="Submit" onClick={() => {}} />
      </View>
    </SafeAreaView>
  );
};
