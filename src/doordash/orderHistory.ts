export interface OrderInterface {
    id: string;
    order_uuid: string;
    delivery_uuid: string;
    delivery_id: string;
    is_consumer_pickup: boolean;
    created_at: number;
    submitted_at: number;
    cancelled_at: number;
    fulfilled_at: number;
    scheduled_delivery_time: number;
    is_group: boolean;
    store: {
        id: string;
        name: string;
        business: {
            id: string;
            name: string;
        };
        phone_number: string;
        fulfills_own_deliveries: boolean;
        customer_arrived_pickup_instructions: string;
        is_price_matching_enabled: boolean;
        price_match_guarantee_info: string;
        store_extensions: {
            customer_support_provider: string;
        };
    };
    creator: {
        id: string;
        first_name: string;
        last_name: string;
    };
    delivery_address: {
        id: string;
        formatted_address: string;
    };
    special_instructions: string;
    orders: {
        id: string;
        creator: {
            id: string;
            first_name: string;
            last_name: string;
        };
        items: {
            id: string;
            name: string;
            special_instructions: string;
            substitution_preference: string;
            quantity: number;
            order_item_extra: any[];
            fulfill_quantity: {
                discrete_quantity: {
                    quantity: number;
                    unit: string;
                };
                continuous_quantity: any;
            }[];
            purchase_quantity: {
                discrete_quantity: {
                    quantity: number;
                    unit: string;
                };
                continuous_quantity: any;
            };
            original_item_price: number;
            purchase_type: string;
            image_url: string;
            item_gift_info: {
                recipient_name: string;
                recipient_phone: string;
                card_message: string;
                card_id: string;
                should_notify_tracking_to_recipient_on_dasher_assign: string;
                should_notify_recipient_for_dasher_questions: string;
                sender_name: string;
                recipient_given_name: string;
                recipient_family_name: string;
                should_recipient_schedule_gift: string;
                recipient_email: string;
                has_gift_intent: string;
                in_gift_store: string;
                type_virtual_gift_card: boolean;
                delivery_channel: string;
                face_values: any;
                customer_select_image_url: string;
                customer_select_image_id: string;
            };
        }[]
    }[]
}

export const orderHistory = async (token: string): Promise<OrderInterface[]> => {
    const resp = await fetch('https://consumer-mobile-bff.doordash.com/v1/orders/', {
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
        throw new Error('Failed to fetch orders');
    }

    return await resp.json() as OrderInterface[]


}