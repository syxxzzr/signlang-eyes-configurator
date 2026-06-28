// Minimal Web Bluetooth type declarations — only the subset this app uses.
// Full types are available via @types/web-bluetooth if you prefer.

interface BluetoothRemoteGATTCharacteristic extends EventTarget {
  readonly uuid: string
  readonly value?: DataView
  readonly properties: {
    write: boolean
    writeWithoutResponse: boolean
    notify: boolean
    read: boolean
  }
  readValue(): Promise<DataView>
  writeValueWithResponse(value: ArrayBuffer | ArrayBufferView): Promise<void>
  writeValueWithoutResponse(value: ArrayBuffer | ArrayBufferView): Promise<void>
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
}

interface BluetoothRemoteGATTService {
  getCharacteristic(uuid: string): Promise<BluetoothRemoteGATTCharacteristic>
}

interface BluetoothRemoteGATTServer {
  readonly connected: boolean
  connect(): Promise<BluetoothRemoteGATTServer>
  disconnect(): void
  getPrimaryService(uuid: string): Promise<BluetoothRemoteGATTService>
}

interface BluetoothDevice extends EventTarget {
  readonly id: string
  readonly name?: string
  readonly gatt?: BluetoothRemoteGATTServer
}

interface RequestDeviceOptions {
  filters?: Array<{ services?: string[]; name?: string; namePrefix?: string }>
  optionalServices?: string[]
  acceptAllDevices?: boolean
}

interface Bluetooth {
  getAvailability(): Promise<boolean>
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>
}

interface Navigator {
  readonly bluetooth?: Bluetooth
}
