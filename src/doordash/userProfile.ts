
export interface ProfileInterface {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_number_components: {
    country_shortname: string,
    country_code: string,
    national_number:string
    international_number:string,
    formatted_international_number: string,
    formatted_national_number: string

  };
  email: string;
  is_password_secure: boolean;
  communication_preferences: {
    receive_text_notifications: boolean;
    receive_marketing_push_notifications: boolean;
    receive_push_notifications: boolean;
  };
  default_country_shortname: string;
  default_profile_address: {
    id: string;
    subpremise: string;
    dasher_instructions: string;
    entry_code: string;
    dropoff_preferences: {
      option_id: string;
      instructions: string;
      is_default: boolean;
    }[];
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    country_shortname: string;
    lat: number;
    lng: number;
    shortname: string;
    printable_address: string;
    submarket_id: string;
    district: {
      id: string;
      timezone: string;
      market_id: string;
    };
    geo_id: string;
    address_link_type: string;
  };

}


export const userProfile = async (token: string): Promise<ProfileInterface> => {
  const resp = await fetch('https://consumer-mobile-bff.doordash.com/v2/consumers/me/', {
    headers: {
      'Host': 'consumer-mobile-bff.doordash.com',
      //'x-client-request-id': '498FD677-131B-4645-8A07-95549B16F389-cx-ios',
      'User-Agent': 'DoordashConsumer/6.11.0 (iPhone; iOS 17.1.1; Scale/3.0)',
      // 'X-EXPERIENCE-ID': 'doordash',
      //  'x-session-id': 'C840FA1E-C76B-4ECF-8764-293828F905A3-cx-ios',
      'Client-Version': 'ios v6.11.0 b167648',
      // 'x-correlation-id': '8AB73477-CA9D-4C7C-A560-7B5290DA65DE-cx-ios',
      'X-SUPPORT-DELIVERY-FEE-SORT': 'true',
      'X-SUPPORT-PARTNER-DASHPASS': 'true',
      'X-Ios-Bundle-Identifier': 'doordash.DoorDashConsumer',
      'X-SUPPORT-NESTED-MENU': 'true',
      // 'dd-ids': '{"dd_session_id":"sx_1331DFE3-D340-400A-816E-67163D823243","dd_login_id":"lx_0E9CF6B1-FC93-4F08-B3DF-35DDD035B225","dd_delivery_correlation_id":"590579fc-1937-4919-886b-6b1aa80106a4","dd_ios_idfa_id":"00000000-0000-0000-0000-000000000000","dd_ios_idfv_id":"24DA2023-4515-4E6F-A237-9F0C645C267E","dd_device_id":"dx_24DA2023-4515-4E6F-A237-9F0C645C267E"}',
      'X-SUPPORT-SCHEDULE-SAVE': 'true',
      'Authorization': `JWT ${token}`,
      'Accept-Language': 'en-US',
      'Accept': 'application/json',
      'dd-product-id': 'consumer/doordash-app'
    }
  });

  if (!resp.ok) {
    throw new Error('Failed to fetch profile');
  }

  return await resp.json() as ProfileInterface


}