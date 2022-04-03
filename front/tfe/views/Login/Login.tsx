import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Button } from "../../components";
import { TextField } from "../../components/TextField";
import { userContext } from "../../context";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(userContext);

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.loginContainer}>
        <View style={styles.headerView}>
          <Text style={styles.loginHeader}>Mobile Babcia</Text>
          <Text style={styles.loginSubheader}>
            Teaching your babcia how to use her phone was never this easy
          </Text>
          <View style={styles.formView}>
            <TextField placeholder="Email" onChange={setEmail}></TextField>
            <TextField
              placeholder="Password"
              secure={true}
              onChange={setPassword}
            ></TextField>
          </View>
        </View>

        <Button
          label="Submit"
          onClick={() => {
            console.log({ email, password });
          }}
        />
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
