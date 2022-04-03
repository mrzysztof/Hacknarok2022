import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { userContext } from "../../../context";
import { isUser } from "../../../utils/isUser";

/**
 * This in an abstract component that wraps the application and
 * initializes configuaration files and 3rd party libraries.
 *
 *
 * Wait for all jobs to complete. If ther are still running show
 * loading screen.
 */
export const AppBootstrapWrapper: React.FC = ({ children }) => {
  const [authenticatingUser, setAuthenticatingUser] = useState<boolean>(true);

  const { fetchUser } = useContext(userContext);

  // Initliaze font.
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  useEffect(() => {
    const checkIfAuth = async () => {
      await fetchUser();
      setAuthenticatingUser(false);
    };

    checkIfAuth();
  }, []);

  const appDidBootstrap = useMemo(
    () => fontsLoaded === true && authenticatingUser == false,
    [fontsLoaded, authenticatingUser]
  );

  // App is still loading
  if (!appDidBootstrap) return null;

  // App did load.
  return <>{children}</>;
};
