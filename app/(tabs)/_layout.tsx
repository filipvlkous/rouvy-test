import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Activities</Label>
        <Icon sf={'house'} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="upload">
        <Label>Upload</Label>
        <Icon sf={'paperplane.fill'} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={'person.fill'} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
