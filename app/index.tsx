import PeripheralsList from "@/components/devicesScan/PeripheralsList";
import { FC } from "react";
import { Button, Text, View } from "react-native";

const Home: FC = () => {
  return (
    <View>
      <PeripheralsList />
    </View>
  );
};

export default Home;
