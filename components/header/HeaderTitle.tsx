import { FC } from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  children: string;
};
const HeaderTitle: FC<Props> = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HeaderTitle;
