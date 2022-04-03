import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

interface OwnProps {
  label: string;
  icon?: string;
  bgColor?: string;
  fontSize?: number;
  onClick: () => void;
}

type TButton = OwnProps;

export const Button: React.FC<TButton> = ({
  label,
  onClick,
  icon,
  bgColor,
  fontSize,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.button, bgColor ? { backgroundColor: bgColor } : {}]}
    >
      <View style={styles.buttonContent}>
        <Text style={[styles.label, { fontSize }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 4,
    paddingVertical: 15,
    backgroundColor: "#5d73e8",
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
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto_700Bold",
  },
});
