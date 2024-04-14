export * from "./orderHistory";
export * from "./submitCode";
export * from "./userProfile";
export * from "./searchRestaurants";
export * from "./addItemToCart";
export * from "./getCart";


export const DOORDASH_HOST = "consumer-mobile-bff.doordash.com";
export const DOORDASH_CLIENT_VERSION = 'ios v6.11.0 b167648';
export const DOORDASH_BUNDLE_IDENTIFIER = 'doordash.DoorDashConsumer';
export const DOORDASH_PRODUCT_ID = 'consumer/doordash-app';
export const DEFAULT_DOORDASH_HEADERS:[string,string][] = [
    ['Host', DOORDASH_HOST],
    ['User-Agent', 'DoordashConsumer/6.11.0 (iPhone; iOS 17.1.1; Scale/3.0)'],
    ['Client-Version', DOORDASH_CLIENT_VERSION],
    ['X-SUPPORT-DELIVERY-FEE-SORT', 'true'],
    ['X-SUPPORT-PARTNER-DASHPASS', 'true'],
    ['X-SUPPORT-NESTED-MENU', 'true',],
    ['X-SUPPORT-SCHEDULE-SAVE', 'true',],
    ['Accept-Language', 'en-US',],
    ["Accept", "application/json"],
    ["Accept-Encoding", 'identity'],
    ['dd-product-id', DOORDASH_PRODUCT_ID],
    ['Connection', 'close']]