import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Login, Dashboard } from "../../../views";
import { userContext } from "../../../context";
import { isUser } from "../../../utils/isUser";

const Stack = createNativeStackNavigator();

export const CoreNavigation: React.FC = () => {
  const { user } = useContext(userContext);

  // If user object exists in a store then we assume that user is authenticated.
  const isAuthenticated = isUser(user);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
