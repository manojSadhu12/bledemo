import { FC, useEffect } from "react";
import HeaderCard from "../header/HeaderCard";
import HeaderTitle from "../header/HeaderTitle";
import { StyleSheet } from "react-native";
import { bleStore, useBleSnap } from "@/store/BleStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";

const PeripheralDetailsHeader: FC = () => {
  const bleSnap = useBleSnap();

  const navigation = useNavigation();

  // Effect
  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      bleStore.disconnect(bleSnap.selectedPeripheral.peripheral?.id);
    });
  }, []);

  return (
    <HeaderCard>
      <Ionicons
        name="arrow-back"
        size={30}
        style={styles.back}
        onPress={() => {
          router.back();
        }}
      />
      <HeaderTitle>
        {bleSnap.selectedPeripheral.peripheral?.name ||
          bleSnap.selectedPeripheral.peripheral?.advertising.localName ||
          ""}
      </HeaderTitle>
    </HeaderCard>
  );
};

const styles = StyleSheet.create({
  back: {
    paddingLeft: 16,
    paddingVertical: 16,
  },
});

export default PeripheralDetailsHeader;
