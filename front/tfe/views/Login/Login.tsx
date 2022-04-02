import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Button } from "../../components";

export const Login: React.FC = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Login page</Text>
        <Button label="Submit" onClick={() => {}} />
      </View>
    </SafeAreaView>
  );
};
