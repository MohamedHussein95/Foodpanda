import "react-native-gesture-handler";
import { useEffect } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import * as splashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
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

  // useEffect(() => {
  //   const onFetchUpdateAsync = async () => {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();

  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         await Updates.reloadAsync();
  //       }
  //     } catch (error) {
  //       alert(`Error fetching latest Expo update: ${error}`);
  //     }
  //   };
  //   onFetchUpdateAsync();
  // }, []);
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
