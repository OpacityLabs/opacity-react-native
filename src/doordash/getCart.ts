import { ExampleCartResp } from "../examples/exampleCartResp";
import { ExampleSearchResp } from "../examples/exampleSearchResp";


export type CartInterface = typeof ExampleCartResp

export const getCart = async (token: string, cartId:string): Promise<CartInterface> => {
    const resp = await fetch(`https://consumer-mobile-bff.doordash.com/v2/carts/${cartId}/item_summary?should_include_submitted=false`, {
        headers: {
          'Host': 'consumer-mobile-bff.doordash.com',
       //   'Cookie': '__cf_bm=5e29YYo0QCYbNAdJf9huKICaJvszsS8g8_NZNibV1bA-1711733288-1.0.1.1-ZO_rjD5Ynobk0Rq.xjsh8tGLZxb7MMFX_kWNWpvsAoP6y2LvSzdCP9lSLgOXd9ef0hvlY7gGsxj8TUSZHwe3Og; _cfuvid=odKo5MaMDMyaid2Mg6JV_LF.4yj5uMgwvgqe5JQNVEI-1711733288081-0.0.1.1-604800000; dd_country_shortname=US; dd_market_id=8; ajs_anonymous_id=e9c62e77-67e5-44d3-822e-34675eba7a15; amplitude_id_8a4cf5f3981e8b7827bab3968fb1ad2bdoordash.com=eyJkZXZpY2VJZCI6IjMzYzk3MzJjLTRlYWQtNDhiYy04MGIyLWFkN2I4MWQ2Nzc0NFIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTcxMTY0NDM3MjcwMCwibGFzdEV2ZW50VGltZSI6MTcxMTY0NDM4NjA5NywiZXZlbnRJZCI6OSwiaWRlbnRpZnlJZCI6MCwic2VxdWVuY2VOdW1iZXIiOjl9; _fbp=fb.1.1711644372816.727849060; _ga=GA1.2.1339392730.1711644373; _ga_9ZH32N32VL=GS1.1.1711644372.1.1.1711644385.0.0.0; _ga_BXB2XKP8LL=GS1.1.1711644372.1.1.1711644385.0.0.0; _ga_J4BQM7M3T2=GS1.1.1711644372.1.1.1711644385.47.0.0; _gcl_au=1.1.91273294.1711644372; _uetvid=affbc470ed2211ee96ac7da0cf96d478|1j31bf6|1711644385909|2|1|bat.bing.com/p/insights/c/n; _yjsu_yjad=1711644373.6bbce707-5f58-4370-8349-462df210fe13',
         // 'x-client-request-id': '130CFCA0-C9A0-404D-98A0-AC1002789ADF-cx-ios',
          'User-Agent': 'DoordashConsumer/6.11.0 (iPhone; iOS 17.1.1; Scale/3.0)',
          'X-EXPERIENCE-ID': 'doordash',
          //'x-session-id': '3720AF31-0152-464F-B770-E9C03631CC46-cx-ios',
          'Client-Version': 'ios v6.11.0 b167648',
          //'x-correlation-id': 'C0D84540-3C98-4D3A-B8B1-436294F56164-cx-ios',
          'X-SUPPORT-DELIVERY-FEE-SORT': 'true',
          'X-SUPPORT-PARTNER-DASHPASS': 'true',
          'X-Ios-Bundle-Identifier': 'doordash.DoorDashConsumer',
          //'DD-LOCATION-CONTEXT': 'eyJhZGRyZXNzX2lkIjoiMzQxNzE5NzE0IiwiY29uc3VtZXJfYWRkcmVzc19saW5rX2lkIjoiMTc3Mzc4NDY5NiIsImNvdW50cnlfc2hvcnRfbmFtZSI6IlVTIiwiZGlzdHJpY3RfaWQiOiIxNjAiLCJsYXQiOjQwLjcwOTQwNywibG5nIjotNzMuOTU4MDQxLCJtYXJrZXRfaWQiOiI4Iiwic3RhdGUiOiJOWSIsInN1Ym1hcmtldF9pZCI6IjgiLCJ0aW1lem9uZSI6IkFtZXJpY2FcL05ld19Zb3JrIiwiemlwY29kZSI6IjExMjExIn0=',
          'X-SUPPORT-NESTED-MENU': 'true',
          //'dd-ids': '{"dd_delivery_correlation_id":"d6d38bef-f65b-4bad-aed5-7202fd2095bc","dd_device_id":"dx_24DA2023-4515-4E6F-A237-9F0C645C267E","dd_login_id":"lx_0E9CF6B1-FC93-4F08-B3DF-35DDD035B225","dd_session_id":"sx_50D052EF-B3AE-48C5-AB8A-80F4AACB4940","dd_ios_idfa_id":"00000000-0000-0000-0000-000000000000","dd_ios_idfv_id":"24DA2023-4515-4E6F-A237-9F0C645C267E"}',
          'X-SUPPORT-SCHEDULE-SAVE': 'true',
          'Authorization': `JWT ${token}`,
          'Accept-Language': 'en-US',
          'Accept': 'application/json',
          'dd-product-id': 'consumer/doordash-app'
        }
      });




    if (!resp.ok) {
        throw new Error('Failed to add to cart');
    }

    return await resp.json() as CartInterface


}