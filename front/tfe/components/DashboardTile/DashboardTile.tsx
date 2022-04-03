import React from "react";
import { View, StyleSheet } from "react-native";

interface DashboardTileProps {
  bgColor?: string;
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
  children,
  bgColor,
}) => {
  return (
    <View style={[styles.tile, bgColor ? { backgroundColor: bgColor } : {}]}>
      <View style={styles.tileContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tileContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
