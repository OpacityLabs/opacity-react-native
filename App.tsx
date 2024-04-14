import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {RecoilRoot} from 'recoil';
import {StackNavigation} from './src/navigation';

export const Main = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <RecoilRoot>
      <Main />
    </RecoilRoot>
  );
}
