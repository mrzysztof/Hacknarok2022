import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppBootstrapWrapper, CoreNavigation } from "./core";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppBootstrapWrapper>
        <CoreNavigation />
      </AppBootstrapWrapper>

      <StatusBar />
    </SafeAreaProvider>
  );
}
