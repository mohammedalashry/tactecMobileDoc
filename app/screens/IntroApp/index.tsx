import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import {FirstPage} from './layout/firstpage';
import {SecondPage} from './layout/secondpage';
import {ThirdPage} from './layout/thirdpage';
import {ForthPage} from './layout/forthpage';
import {LastPage} from './layout/lastpage';
import {load} from 'utils/storage';
import {UserRole} from '@app/navigation';

const IntroApp = ({navigation}) => {
  console.log('11-', navigation);

  const [num, setNum] = useState(1);

  const handleIntialRouteName = async () => {
    const user = await load('userData');

    if (user?.userData?.role === 'tactic') {
      return navigation.reset({
        index: 0,
        routes: [{name: UserRole.TACTICAL}], // Updated route name
      });
    } else if (user?.userData?.role === 'medical') {
      return navigation.reset({
        index: 0,
        routes: [{name: UserRole.MEDICAL}], // Updated route name
      });
    } else if (user?.userData.role === 'management') {
      return navigation.reset({
        index: 0,
        routes: [{name: UserRole.MANAGEMENT}], // Updated route name
      });
    } else {
      return navigation.reset({
        index: 0,
        routes: [{name: UserRole.PLAYER}], // Updated route name
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {num == 1 && (
        <FirstPage
          num={num}
          setNum={setNum}
          handleIntialRouteName={handleIntialRouteName}
        />
      )}
      {num == 2 && (
        <SecondPage
          num={num}
          setNum={setNum}
          handleIntialRouteName={handleIntialRouteName}
        />
      )}
      {num == 3 && (
        <ThirdPage
          num={num}
          setNum={setNum}
          handleIntialRouteName={handleIntialRouteName}
        />
      )}
      {num == 4 && (
        <ForthPage
          num={num}
          setNum={setNum}
          handleIntialRouteName={handleIntialRouteName}
        />
      )}
      {num == 5 && (
        <LastPage
          num={num}
          setNum={setNum}
          handleIntialRouteName={handleIntialRouteName}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default IntroApp;
