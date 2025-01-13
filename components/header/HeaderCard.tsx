import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

const HeaderCard: FC<PropsWithChildren> = ({ children }) => {
  return <View style={[styles.card, styles.shadow]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default HeaderCard;
