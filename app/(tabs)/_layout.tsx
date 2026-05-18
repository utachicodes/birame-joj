import { Tabs } from 'expo-router';
import TabBar from '../../src/components/TabBar'; // custom tab bar component

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />} // swap default tab bar with ours
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tickets" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="transport" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
