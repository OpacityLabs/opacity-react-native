import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {hasTokenSelector, tokenState} from '../../atoms';
import {NavParams} from '../../navigation';

interface Props {
  navigation: NavigationProp<NavParams, 'Home'>;
}

export const Home = ({navigation}: Props) => {
  const {navigate} = navigation;
  const hasToken = useRecoilValue(hasTokenSelector);
  const resetToken = useResetRecoilState(tokenState);

  const gotoLogin = () => {
    if (hasToken) {
      resetToken();
    }
    navigate('Login');
  };
  const gotoProfile = () => navigate('Profile');

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Image
            className="h-24 w-48"
            source={require('../../../assets/images/logo.png')}
          />
        </View>
        <View className="mb-4 space-y-3 px-6">
          <Pressable
            className="h-14 w-full items-center justify-center rounded-full bg-black"
            onPress={gotoLogin}>
            <Text className="text-lg text-white">
              {hasToken ? 'Re-login' : 'Login'}
            </Text>
          </Pressable>

          {hasToken ? (
            <Pressable
              className="h-14 w-full items-center justify-center rounded-full border border-black bg-white"
              onPress={gotoProfile}>
              <Text className="text-lg text-black">User profile</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};
