import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLayout } from './src/layout/AppLayout';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppLayout />
    </SafeAreaProvider>
  );
}
