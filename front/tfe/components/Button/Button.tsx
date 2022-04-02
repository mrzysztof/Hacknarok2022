import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

interface OwnProps {
  label: string;
  icon?: string;
  onClick: () => void;
}

type TButton = OwnProps;

export const Button: React.FC<TButton> = ({ label, onClick, icon }) => {
  return (
    <TouchableOpacity style={styles.button}>
      <View style={styles.buttonContent}>
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 4,
    paddingVertical: 15,
    backgroundColor: "#C7D1E5",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonContent: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontFamily: "Roboto_700Bold",
  },
});
