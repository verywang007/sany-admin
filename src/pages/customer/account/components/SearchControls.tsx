import { Switch } from 'antd';

interface ControlProps<V> {
  value?: V;
  onChange?: (v: V) => void;
}

/** 「已审核设备」开关：把 Switch 适配成 Form.Item 可托管的 value/onChange 控件 */
export function DeviceSwitch({ value, onChange }: ControlProps<boolean>) {
  return <Switch checked={!!value} onChange={(v) => onChange?.(v)} />;
}
