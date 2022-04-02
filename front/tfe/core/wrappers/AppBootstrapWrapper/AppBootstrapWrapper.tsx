import React, { useMemo } from "react";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";

/**
 * This in an abstract component that wraps the application and
 * initializes configuaration files and 3rd party libraries.
 *
 *
 * Wait for all jobs to complete. If ther are still running show
 * loading screen.
 */
export const AppBootstrapWrapper: React.FC = ({ children }) => {
  // Initliaze font.
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  const appDidBootstrap = useMemo(() => fontsLoaded === true, [fontsLoaded]);

  // App is still loading
  if (!appDidBootstrap) return null;

  // App did load.
  return <>{children}</>;
};
