// import {RootStore, RootStoreProvider, setupRootStore} from 'models';
import {QueryClient, QueryClientProvider} from 'react-query';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import {
  AppNavigator,
  // canExit,
  NavigatorParamList,
  // useBackButtonHandler,
} from 'navigators';
import {persistor, store} from '@app/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ErrorBoundary} from 'screens/Error/error-boundary';
import {LoadingModalWithContext, Toast} from 'components';
import * as storage from '@app/utils/storage';
import {RootStore, RootStoreProvider, setupRootStore} from 'models';
import {Platform, SafeAreaView} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LogBox, StatusBar} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {saveString, loadString} from '@app/utils/storage';
import LogRocket from '@logrocket/react-native';
import {color} from 'theme';

const App = () => {
  LogBox.ignoreLogs(['Warning: ...']);

  // Ignore all log notifications:
  LogBox.ignoreAllLogs();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    // const deviceRemote: any =
    //   await messaging().registerDeviceForRemoteMessages();
    console.log('45-', enabled);

    if (enabled) {
      try {
        const token = await messaging().getToken();

        await saveString('fcmToken', token);
      } catch (e) {
        console.log('53-', e);
      }
    }
  }

  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined);
  const [initialRouteName, setInitialRouteName] =
    useState<keyof NavigatorParamList>('MainTabGroup');

  // useBackButtonHandler(canExit);

  useEffect(() => {
    LogRocket.init('yo5s8p/ud-almeria');

    loadString('fcmToken').then(token => {
      console.log('81-', token);

      if (!token) {
        requestUserPermission();
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      // .. handle inital route name
      const getInitailRouteName = await handleIntialRouteName();

      setInitialRouteName(getInitailRouteName);

      // .. set language
      // store.dispatch<RootStateOrAny>(loadDefaults());

      setupRootStore().then(setRootStore);

      // crashlytics.init();
      // analytics.logAppOpen();

      // .. fire callback if app in foreground
      messaging().onMessage(fireLocalNotifications);

      // .. fire if app is closed or in background
      messaging().onNotificationOpenedApp(notificationsCallback);

      // .. handle forground notifications callback
      notifee.onForegroundEvent(action => {
        switch (action.type) {
          case EventType.PRESS: {
            notificationsCallback(action.detail.notification);
          }
        }
      });

      const initalNotifications = await messaging().getInitialNotification();
      if (initalNotifications) {
        notificationsCallback(initalNotifications.data);
      }

      const initNotifeeeNotifications = await notifee.getInitialNotification();
      if (initNotifeeeNotifications) {
        notificationsCallback(initNotifeeeNotifications.notification);
      }
    })();
  }, []);

  const notificationsCallback = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | any,
  ) => {
    // .. callback fire on click on notifications
    // const extraInfo = JSON.parse(remoteMessage?.data?.data || remoteMessage?.data);
  };

  const fireLocalNotifications = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Wecrea8',
    });

    if (remoteMessage?.notification) {
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
            mainComponent: 'App',
          },
        },
      });
    } else {
      await notifee.displayNotification({
        title: remoteMessage?.data?.title,
        body: remoteMessage?.data?.message,
        android: {
          channelId,
          pressAction: {
            id: 'default',
            mainComponent: 'App',
          },
        },
        data: {data: remoteMessage?.data?.data || ''},
      });
    }
  };

  const handleIntialRouteName = async () => {
    // .. check if user didn't choose gender yet
    const user = await storage.load('userData');
    const introDone = await storage.load('introDone');

    if (!user) {
      return 'LoginScreen';
    }
    if (user && !introDone) {
      return 'IntroApp';
    }
    if (user?.userData?.role === 'tactic') {
      return 'HomeTabs';
    } else if (user?.userData?.role === 'medical') {
      return 'MedicalBottomTab';
    } else if (user?.userData.role === 'management') {
      return 'ManagementBottomTab';
    }
    {
      return 'PlayerBottomTab';
    }
  };

  const queryClient = new QueryClient();

  if (!rootStore) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ToggleStorybook> */}
      <RootStoreProvider value={rootStore}>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
              {/* <ConfigModal> */}
              <ErrorBoundary catchErrors={'always'}>
                <Toast>
                  <LoadingModalWithContext>
                    <GestureHandlerRootView style={{flex: 1}}>
                      <SafeAreaView
                        style={{flex: 1, backgroundColor: color.black}}>
                        <StatusBar barStyle="light-content" />
                        <AppNavigator initialRouteName={initialRouteName} />
                      </SafeAreaView>
                    </GestureHandlerRootView>
                  </LoadingModalWithContext>
                </Toast>
              </ErrorBoundary>
              {/* </ConfigModal> */}
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </RootStoreProvider>

      {/* </ToggleStorybook> */}
    </QueryClientProvider>
  );
};

export default App;
