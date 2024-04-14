import { ExampleSearchResp } from "../examples/exampleSearchResp";


export interface AddToCartRespInterface {
	id:string,
	cart: {
		id: string
	}
}

export const addItemToCart = async (token: string, storeId:string): Promise<AddToCartRespInterface> => {
    const resp = await fetch('https://consumer-mobile-bff.doordash.com/v3/carts/add_item?should_include_submitted=true', {
        method: 'POST',
        headers: {
          'Host': 'consumer-mobile-bff.doordash.com',
       //   'Cookie': '__cf_bm=7qnpkrBUULIhiz4s5RKPOzlATt5UWJQzTzPNnLz78XQ-1711733286-1.0.1.1-namMvV0DF6xZaEbT1vnPwK49KevJJM0Yc6IZA77JZ._GpZ9JuWdV4adEznlmFo.LIwl6LeqqnwMvnTUO.vwWVA; _cfuvid=W1_jXOaEjMecWbgrDWBmaLMg5xS78IAT5B3wSudW6Kg-1711733286369-0.0.1.1-604800000; dd_country_shortname=US; dd_market_id=8; ajs_anonymous_id=e9c62e77-67e5-44d3-822e-34675eba7a15; amplitude_id_8a4cf5f3981e8b7827bab3968fb1ad2bdoordash.com=eyJkZXZpY2VJZCI6IjMzYzk3MzJjLTRlYWQtNDhiYy04MGIyLWFkN2I4MWQ2Nzc0NFIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTcxMTY0NDM3MjcwMCwibGFzdEV2ZW50VGltZSI6MTcxMTY0NDM4NjA5NywiZXZlbnRJZCI6OSwiaWRlbnRpZnlJZCI6MCwic2VxdWVuY2VOdW1iZXIiOjl9; _fbp=fb.1.1711644372816.727849060; _ga=GA1.2.1339392730.1711644373; _ga_9ZH32N32VL=GS1.1.1711644372.1.1.1711644385.0.0.0; _ga_BXB2XKP8LL=GS1.1.1711644372.1.1.1711644385.0.0.0; _ga_J4BQM7M3T2=GS1.1.1711644372.1.1.1711644385.47.0.0; _gcl_au=1.1.91273294.1711644372; _uetvid=affbc470ed2211ee96ac7da0cf96d478|1j31bf6|1711644385909|2|1|bat.bing.com/p/insights/c/n; _yjsu_yjad=1711644373.6bbce707-5f58-4370-8349-462df210fe13',
         // 'x-client-request-id': '0DFEEABE-5502-4EE1-B49A-027E97DE73A3-cx-ios',
          'User-Agent': 'DoordashConsumer/6.11.0 (iPhone; iOS 17.1.1; Scale/3.0)',
          'X-EXPERIENCE-ID': 'doordash',
          //'x-session-id': 'AAE039B8-E4A8-4AD0-8940-32A3BD4609F1-cx-ios',
          'x-bff-error-format': 'v2',
          //'x-correlation-id': 'CE6DD67C-036A-4FC4-A48C-78C2150FF084-cx-ios',
          'X-SUPPORT-DELIVERY-FEE-SORT': 'true',
          'X-SUPPORT-PARTNER-DASHPASS': 'true',
          'Client-Version': 'ios v6.11.0 b167648',
          'X-Ios-Bundle-Identifier': 'doordash.DoorDashConsumer',
          //'DD-LOCATION-CONTEXT': 'eyJhZGRyZXNzX2lkIjoiMzQxNzE5NzE0IiwiY29uc3VtZXJfYWRkcmVzc19saW5rX2lkIjoiMTc3Mzc4NDY5NiIsImNvdW50cnlfc2hvcnRfbmFtZSI6IlVTIiwiZGlzdHJpY3RfaWQiOiIxNjAiLCJsYXQiOjQwLjcwOTQwNywibG5nIjotNzMuOTU4MDQxLCJtYXJrZXRfaWQiOiI4Iiwic3RhdGUiOiJOWSIsInN1Ym1hcmtldF9pZCI6IjgiLCJ0aW1lem9uZSI6IkFtZXJpY2FcL05ld19Zb3JrIiwiemlwY29kZSI6IjExMjExIn0=',
          'X-SUPPORT-NESTED-MENU': 'true',
        //  'dd-ids': '{"dd_delivery_correlation_id":"d6d38bef-f65b-4bad-aed5-7202fd2095bc","dd_device_id":"dx_24DA2023-4515-4E6F-A237-9F0C645C267E","dd_login_id":"lx_0E9CF6B1-FC93-4F08-B3DF-35DDD035B225","dd_session_id":"sx_50D052EF-B3AE-48C5-AB8A-80F4AACB4940","dd_ios_idfa_id":"00000000-0000-0000-0000-000000000000","dd_ios_idfv_id":"24DA2023-4515-4E6F-A237-9F0C645C267E"}',
          'X-SUPPORT-SCHEDULE-SAVE': 'true',
          'Authorization': `JWT ${token}`,
          'Accept-Language': 'en-US',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'dd-product-id': 'consumer/doordash-app'
        },
        // body: '{"cart_experience":"multi_cart","store":{"id":"24669844"},"is_ads_item":false,"dedupe_item_uuid":false,"unit_price":1699,"is_bundle":false,"item":{"image_url":"https:\\/\\/img.cdn4dd.com\\/p\\/width=1200,height=672,format=auto,fit=contain\\/media\\/photosV2\\/2bc598f9-4edd-4bc0-b258-a16008941f32-retina-large.jpeg","description":"4 pcs. A Jet\'s Exclusive! 4 Detroit-Style deep dish corner slices with premium mozzarella & your choice of toppings. \\n","id":"7590548836","category_name":"","name":"4 Corner Pizza®","menu_id":"20046156"},"substitution_preference":"substitute","special_instructions":"","options":[{"item_extra_option":{"charge_above":0,"name":"Pizza Sauce - Regular","price":0,"id":"36388223603","description":"","item_extra_name":"","default_quantity":0},"quantity":1,"options":[],"id":"36388223603"}],"fulfillment_type":"DELIVERY","currency":"USD","is_lunchpass":false,"quantity":1}',
        body: JSON.stringify({
          'cart_experience': 'multi_cart',
          'store': {
            'id': storeId
          },
          'is_ads_item': false,
          'dedupe_item_uuid': false,
          'unit_price': 1699,
          'is_bundle': false,
          'item': {
            'image_url': 'https://img.cdn4dd.com/p/width=1200,height=672,format=auto,fit=contain/media/photosV2/2bc598f9-4edd-4bc0-b258-a16008941f32-retina-large.jpeg',
            'description': '4 pcs. A Jet\'s Exclusive! 4 Detroit-Style deep dish corner slices with premium mozzarella & your choice of toppings. \n',
            'id': '7590548836',
            'category_name': '',
            'name': '4 Corner Pizza\xAE',
            'menu_id': '20046156'
          },
          'substitution_preference': 'substitute',
          'special_instructions': '',
          'options': [
            {
              'item_extra_option': {
                'charge_above': 0,
                'name': 'Pizza Sauce - Regular',
                'price': 0,
                'id': '36388223603',
                'description': '',
                'item_extra_name': '',
                'default_quantity': 0
              },
              'quantity': 1,
              'options': [],
              'id': '36388223603'
            }
          ],
          'fulfillment_type': 'DELIVERY',
          'currency': 'USD',
          'is_lunchpass': false,
          'quantity': 1
        })
      });




    if (!resp.ok) {
        throw new Error('Failed to add to cart');
    }

    return await resp.json() as AddToCartRespInterface


}