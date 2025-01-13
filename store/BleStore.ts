import { proxy, useSnapshot } from "valtio";
import BleManager, {
  BleState,
  Descriptor,
  Peripheral,
  PeripheralInfo,
} from "react-native-ble-manager";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

export type ParsedInfo =
  | {
      characteristics:
        | {
            properties: string[];
            characteristic: string;
            service: string;
            descriptors?: Descriptor[];
          }[]
        | undefined;
      uuid: string;
    }[]
  | undefined;

/**
 * I have choosed class based Store as in a real app I leverage TS 5 decorators(Which only work in classes) for lot of operations
 */
class BleStore {
  isBleStarted = false;
  isBleStartFailed = false;
  areBluetoothPermissionsGranted = false;
  isBluetoothEnabled = false;
  isScanning = false;
  peripherals: Peripheral[] = [];
  selectedPeripheral: {
    isConnected?: boolean;
    peripheral?: Peripheral | undefined;
    info?: PeripheralInfo | undefined;
    parsedInfo?: ParsedInfo;
    error?: string | undefined;
  } = {};

  async init() {
    if (await this.requestPermissions()) {
      this.enableLocationAndBluetooth();

      this.start();

      BleManager.onDidUpdateState(({ state }: { state: BleState }) => {
        if (!this.isBluetoothEnabled && state == BleState.On) {
          this.isBluetoothEnabled = true;
          this.scan();
        }

        this.isBluetoothEnabled = state == BleState.On;
      });

      BleManager.onStopScan(async () => {
        this.peripherals = await BleManager.getDiscoveredPeripherals();
        this.isScanning = false;
      });

      BleManager.onDiscoverPeripheral((peripheral: Peripheral) => {
        const index = this.peripherals.findIndex(
          (it) => it.id == peripheral.id,
        );

        if (index == -1) {
          this.peripherals.push(peripheral);
        } else {
          this.peripherals[index] = peripheral;
        }

        if (this.selectedPeripheral.peripheral?.id == peripheral.id) {
          this.selectedPeripheral.peripheral = peripheral;
        }
      });

      BleManager.onDisconnectPeripheral(
        ({ peripheral }: { peripheral: string }) => {
          if (this.selectedPeripheral.peripheral?.id == peripheral) {
            this.selectedPeripheral.error = "Periferal is disconnected";
          }
        },
      );
    }
  }

  private async start() {
    if (!this.isBleStarted) {
      try {
        await BleManager.start();
        this.isBleStarted = true;
      } catch (e) {
        this.isBleStartFailed = true;
      }
    }
  }

  async checkBluetoothState() {
    this.isBluetoothEnabled = (await BleManager.checkState()) == BleState.On;
    return this.isBluetoothEnabled;
  }

  async enableLocationAndBluetooth() {
    if (!(await Location.hasServicesEnabledAsync())) {
      try {
        await Location.enableNetworkProviderAsync();

        if (!(await Location.hasServicesEnabledAsync())) {
          return false;
        }
      } catch (e) {
        return false;
      }
    }

    if (await this.checkBluetoothState()) {
      return true;
    }

    this.requestBluetooth();
    return false;
  }

  private requestBluetooth() {
    Alert.alert("", "Please turn on your bluetooth to scan nearby devices", [
      {
        text: "Settings",
        onPress: () => {
          Platform.OS === "ios"
            ? Linking.openURL("App-Prefs:Bluetooth")
            : Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
        },
      },
    ]);
  }

  async scan() {
    if (
      (await this.requestPermissions()) &&
      (await this.enableLocationAndBluetooth())
    ) {
      await this.start();

      try {
        this.isScanning = true;

        this.peripherals = [];
        this.selectedPeripheral = {};

        await BleManager.scan([], 0, false);
      } catch (e) {
        this.isScanning = false;
        console.error("Failed to scan", e);
      }
    }
  }

  async stopScan() {
    await BleManager.stopScan();
  }

  private async requestPermissions() {
    const permissions =
      Platform.OS == "ios"
        ? [
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            PERMISSIONS.IOS.BLUETOOTH,
          ]
        : [
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          ];

    const permissionStatus = await requestMultiple(permissions);

    return permissions.every(
      (permission) => permissionStatus[permission] == "granted",
    );
  }

  async connect(peripheralId: string) {
    try {
      const p = this.peripherals.find((it) => it.id == peripheralId);
      this.selectedPeripheral = { peripheral: p };

      await BleManager.connect(peripheralId);
      this.selectedPeripheral.isConnected = true;
      const receivedInfo = await this.retriveServices(peripheralId);
      this.selectedPeripheral.info = receivedInfo?.info;
      this.selectedPeripheral.parsedInfo = receivedInfo?.parsedInfo;

      return this.selectedPeripheral;
    } catch (e: any) {
      this.selectedPeripheral.error = e.toString();
    }
  }

  async disconnect(peripheralId?: string) {
    if (peripheralId && this.selectedPeripheral.isConnected) {
      this.selectedPeripheral = {};
      BleManager.disconnect(peripheralId);
    }
  }

  async retriveServices(peripheralId: string) {
    const info = await BleManager.retrieveServices(peripheralId);

    const parsedInfo = info.services?.map((service) => ({
      ...service,
      characteristics: info.characteristics
        ?.filter((characteristic) => service.uuid == characteristic.service)
        ?.map((characteristic) => ({
          ...characteristic,
          properties: Object.keys(characteristic.properties),
          descriptors: characteristic.descriptors?.filter((it) => it.value),
        })),
    }));

    return { info, parsedInfo };
  }
}

export const bleStore = proxy(new BleStore());
bleStore.init();
export const useBleSnap = () => useSnapshot(bleStore);
