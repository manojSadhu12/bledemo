import { bleStore, useBleSnap } from "@/store/BleStore";
import { router } from "expo-router";
import { FC } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

const PeripheralsList: FC = () => {
  const bleSnap = useBleSnap();

  return (
    <FlatList
      data={bleSnap.peripherals}
      keyExtractor={(it) => it.id}
      style={{ marginTop: 16 }}
      ListFooterComponent={() => <View style={{ marginBottom: 100 }} />}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={{ gap: 10 }}>
            <View style={styles.item2}>
              <Text style={styles.name}>
                {item.name || item.advertising.localName || "N/A"}
              </Text>
              {item.advertising.isConnectable ? (
                <Button
                  title="Connect"
                  onPress={() => {
                    bleStore.connect(item.id);
                    router.navigate("/peripheralDetails");
                  }}
                />
              ) : (
                <Text style={styles.notConnectable}>Not Connectable</Text>
              )}
            </View>
            <View style={styles.item2}>
              <Text>{item.id}</Text>
              <Text>{item.rssi} dbm</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  item2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: "lightgrey",
    marginTop: 8,
  },
  notConnectable: {
    color: "red",
  },
});

export default PeripheralsList;
