import { NavigationProp } from '@react-navigation/core';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartIdState, cartState, ordersState, profileState, searchResultsState, tokenState } from '../../atoms';
import { addItemToCart, getCart, orderHistory, searchRestaurants, userProfile } from '../../doordash';
import { NavParams } from '../../navigation';
import { generateDoorDashProof, getProfileRedactStrings, notarizeDoorDashProfileRequest } from '../../doordash/notarize';


interface Props {
  navigation: NavigationProp<NavParams, 'Profile'>;
}

export const Profile = ({ navigation }: Props) => {
  const { goBack } = navigation;


  const [search, setSearch] = useState('pizza');

  const token = useRecoilValue(tokenState);
  const [profile, setProfile] = useRecoilState(profileState);
  const [orders, setOrders] = useRecoilState(ordersState);
  const [searchResults, setSearchResults] = useRecoilState(searchResultsState);
  const [cartId, setCartId] = useRecoilState(cartIdState);
  const [cart, setCart] = useRecoilState(cartState);

  const totalSpent = useMemo(() => {
    return (
      orders.reduce((acc, order) => {
        return (
          acc +
          order.orders.reduce((acc, order) => {
            return (
              acc +
              order.items.reduce((acc, item) => {
                return acc + item.original_item_price;
              }, 0)
            );
          }, 0)
        );
      }, 0) / 100
    );
  }, [orders]);


  const numRestaurantsNearby = useMemo(() => {
    if (!searchResults?.body.length) return 0

    let count = 0

    for (let i = 0; i < searchResults.body.length; i++) {
      count += searchResults.body[i].body.length
    }

    return count
  }, [searchResults]);





  useEffect(() => {
    if (token) {
      console.log('HERE', token);
      userProfile(token).then(resp => {
        console.log('User profile', resp);
        setProfile(resp);
      });
      orderHistory(token).then(resp => {
        console.log('Order history', resp);
        setOrders(resp);
      });
      searchRestaurants(token, search).then(resp => {
        console.log('Search results', resp);
        setSearchResults(resp);
      });
      // addItemToCart(token, "24669844").then(resp => {
      //   console.log('Add to cart results', resp);
      //   setCartId(resp.cart.id);
      // });

    }
  }, [token]);

  useEffect(() => {
    if (cartId && token) {
      getCart(token, cartId).then(resp => {
        console.log('Cart', resp);
        setCart(resp);
      })

    }
  }, [cartId, token]);



  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center">
        <Chase size={96} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar style="auto" />

        <View className="mb-4 mt-2 flex-row items-center justify-between border-b border-gray-200 px-4 pb-2">
          <Pressable className="w-8" onPress={goBack}>
            <Text className="text-xs text-gray-600">Back</Text>
          </Pressable>
          <Text className="text-sm">Profile</Text>
          <View className="w-8"></View>
        </View>

        <View className="mt-4 flex-1 space-y-4 px-4">
          <View>
            <Text className="text-xs font-medium text-gray-600">Name</Text>
            <Text className="text-lg font-light text-black">
              {`${profile.first_name} ${profile.last_name}`}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium text-gray-600">
              Number of orders
            </Text>
            <Text className="text-lg font-light text-black">
              {orders.length}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium text-gray-600">
              Total spend
            </Text>
            <Text className="text-lg font-light text-black">
              {`$${totalSpent.toFixed(2)}`}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium text-gray-600">
              Pizza restaurants nearby
            </Text>
            <Text className="text-lg font-light text-black">
              {numRestaurantsNearby}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium text-gray-600">
              Cart total
            </Text>
            <Text className="text-lg font-light text-black">
              {cart?.subtotal_monetary_fields.display_string ?? "$0"}
            </Text>
            {profile && token && <Pressable
              className="h-14 w-full items-center justify-center rounded-full border border-black bg-white"
              onPress={(async () => {
                const request = notarizeDoorDashProfileRequest(token, getProfileRedactStrings(profile))
                const proof = await generateDoorDashProof(request)
                console.log('MPC-TLS Proof', proof)
              })}>
              <Text className="text-lg text-black">Generate proof</Text>
            </Pressable>}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
