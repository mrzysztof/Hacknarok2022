import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CoreNavigation } from "./core/navigation/CoreNavigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <CoreNavigation />
      <StatusBar />
    </SafeAreaProvider>
  );
}
