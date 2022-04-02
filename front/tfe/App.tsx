import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppBootstrapWrapper, CoreNavigation } from "./core";
import { UserContextProvider } from "./context";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserContextProvider>
        <AppBootstrapWrapper>
          <CoreNavigation />
        </AppBootstrapWrapper>
      </UserContextProvider>

      <StatusBar />
    </SafeAreaProvider>
  );
}
