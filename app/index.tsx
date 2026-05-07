import { Redirect } from 'expo-router';

export default function Index() {
  // In production: check AsyncStorage for onboarding completion & auth token
  return <Redirect href="/onboarding" />;
}
