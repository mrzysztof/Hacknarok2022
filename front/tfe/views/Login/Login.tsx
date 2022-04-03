import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Button } from "../../components";
import { TextField } from "../../components/TextField";
import { userContext } from "../../context";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(userContext);

  const handleLogin = async () => {
    if (username.length > 0 && password.length > 0) {
      console.log({ username, password });
      await login(username, password);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.loginContainer}>
        <View style={styles.headerView}>
          <Text style={styles.loginHeader}>Mobile Babcia</Text>
          <Text style={styles.loginSubheader}>
            Teaching your babcia how to use her phone was never this easy
          </Text>
          <View style={styles.formView}>
            <TextField
              placeholder="Username"
              onChange={setUsername}
              secure={false}
            ></TextField>
            <TextField
              placeholder="Password"
              secure
              onChange={setPassword}
            ></TextField>
          </View>
        </View>

        <Button label="Submit" onClick={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formView: {
    width: "100%",
    flex: 1,
  },
  safeAreaStyle: {
    height: "100%",
  },
  loginContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
    flex: 1,
  },
  headerView: {
    flex: 1,
    width: "100%",
  },
  loginHeader: {
    fontSize: 42,
    marginBottom: 10,
    textAlign: "center",
  },
  loginSubheader: {
    color: "#565656",
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 40,
  },
});
