import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

interface OwnProps {
  label: string;
  icon?: string;
  onClick: () => void;
}

type TButton = OwnProps;

export const Button: React.FC<TButton> = ({ label, onClick, icon }) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 2,
    paddingVertical: 15,
    backgroundColor: "#3E6990",
    justifyContent: "center",
  },
});
