import { FC } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { bleStore, useBleSnap } from "@/store/BleStore";
import HeaderCard from "../header/HeaderCard";
import HeaderTitle from "../header/HeaderTitle";

const Header: FC = () => {
  const bleSnap = useBleSnap();

  return (
    <HeaderCard>
      <HeaderTitle>Devices</HeaderTitle>
      {bleSnap.isScanning ? (
        <TouchableOpacity
          onPress={() => {
            bleStore.stopScan();
          }}
        >
          <ActivityIndicator color="black" style={styles.reload} />
        </TouchableOpacity>
      ) : (
        <Ionicons
          name="reload"
          size={20}
          style={styles.reload}
          onPress={() => {
            bleStore.scan();
          }}
        />
      )}
    </HeaderCard>
  );
};

const styles = StyleSheet.create({
  reload: {
    padding: 12,
    paddingRight: 16,
  },
});

export default Header;
