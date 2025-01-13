import { useBleSnap } from "@/store/BleStore";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const SelectedPeripheralDetails: FC = () => {
  const bleSnap = useBleSnap();

  return (
    bleSnap.selectedPeripheral.peripheral && (
      <View style={styles.details}>
        <Text style={styles.text}>
          {bleSnap.selectedPeripheral.peripheral.id}
        </Text>
        <Text style={styles.text}>
          {bleSnap.selectedPeripheral.peripheral.rssi} dbm
        </Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  details: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
  },
});

export default SelectedPeripheralDetails;
