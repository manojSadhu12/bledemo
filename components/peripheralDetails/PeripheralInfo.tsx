import globalStyles from "@/global_styles/styles";
import { useBleSnap } from "@/store/BleStore";
import { router } from "expo-router";
import { FC, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PeripheralInfo: FC = () => {
  const bleSnap = useBleSnap();

  useEffect(() => {
    if (bleSnap.selectedPeripheral.error) {
      Alert.alert("", bleSnap.selectedPeripheral.error, [
        {
          text: "Ok",
          onPress() {
            router.back();
          },
        },
      ]);
    }
  }, [!!bleSnap.selectedPeripheral.error]); // !! ensures alert is only trigerred once

  if (bleSnap.selectedPeripheral && !bleSnap.selectedPeripheral.error) {
    if (!bleSnap.selectedPeripheral.isConnected) {
      return <ConnectLoader>Connecting to the periferal</ConnectLoader>;
    } else if (!bleSnap.selectedPeripheral.info) {
      return <ConnectLoader>Fetching services</ConnectLoader>;
    }

    return (
      <ScrollView>
        <View style={styles.main}>
          <Text style={styles.services}>Services</Text>
          {bleSnap.selectedPeripheral.parsedInfo &&
            bleSnap.selectedPeripheral.parsedInfo.map((service) => (
              <View key={service.uuid} style={styles.serviceCard}>
                <Text style={styles.servicesName}>{service.uuid}</Text>
                {service.characteristics?.map((characteristic) => (
                  <View
                    key={characteristic.characteristic}
                    style={styles.characteristic}
                  >
                    <Text style={styles.propertyKey}>
                      {characteristic.characteristic}
                    </Text>

                    <View style={styles.property}>
                      <Text style={styles.propertyKey}>Properties:</Text>
                      <Text>{characteristic.properties.join(", ")}</Text>
                    </View>

                    {!!characteristic.descriptors?.length && (
                      <>
                        <Text style={styles.propertyKey}>Descriptors:</Text>
                        {characteristic.descriptors.map((descriptor) => (
                          <Text>{descriptor.value}</Text>
                        ))}
                      </>
                    )}
                    {/* <Text>{characteristic.descriptors?.join(', ')}</Text> */}
                  </View>
                ))}
              </View>
            ))}
        </View>
      </ScrollView>
    );
  }

  return null;
};

const ConnectLoader: FC<{ children: string }> = ({ children }) => {
  return (
    <View style={[globalStyles.flex_1, globalStyles.center]}>
      <ActivityIndicator color="black" size={"large"} />
      <Text>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 16,
  },
  serviceCard: {
    padding: 12,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  services: {
    fontSize: 20,
    fontWeight: "bold",
  },
  servicesName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  characteristic: {
    marginVertical: 8,
  },
  property: {
    flexDirection: "row",
    gap: 8,
  },
  propertyKey: {
    fontWeight: "bold",
  },
});

export default PeripheralInfo;
