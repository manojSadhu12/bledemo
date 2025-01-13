import ScanHeader from "@/components/devicesScan/ScanHeader";
import PeripheralDetailsHeader from "@/components/peripheralDetails/PeripheralDetailsHeader";
import { Stack } from "expo-router";
import { FC } from "react";
import { StatusBar } from "react-native";

const MainLayout: FC = () => {
  return (
    <>
      <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
      <Stack>
        <Stack.Screen name="index" options={{ header: ScanHeader }} />
        <Stack.Screen
          name="peripheralDetails"
          options={{ header: PeripheralDetailsHeader }}
        />
      </Stack>
    </>
  );
};

export default MainLayout;
