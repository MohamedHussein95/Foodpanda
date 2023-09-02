import "react-native-gesture-handler";

import { RootSiblingParent } from "react-native-root-siblings";
import * as splashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import { Fonts } from "./src/constants";
import AppNavigator from "./src/navigation/AppNavigator";

splashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded] = useFonts(Fonts);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await splashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar />
      <RootSiblingParent>
        <Provider store={store}>
          <PaperProvider>
            <AppNavigator onReady={onLayoutRootView} />
          </PaperProvider>
        </Provider>
      </RootSiblingParent>
    </>
  );
};

export default App;
