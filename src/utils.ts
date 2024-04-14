function generateUUID(): string {
    const hexDigits = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4';
        } else if (i === 19) {
            uuid += hexDigits.substr(Math.floor(Math.random() * 4), 1) + '8';
        } else {
            uuid += hexDigits.substr(Math.floor(Math.random() * 16), 1);
        }
    }

    return uuid;
}


export const randomDeviceId = () => {
    return `dx_${generateUUID().toUpperCase()}`
}

export const randomState = () => {
    return `sx_${generateUUID().toUpperCase()}`
}

export const generateDoordashLoginUrl = (deviceId: string, state: string) => `https://identity.doordash.com/auth?client_id=1692922242639331568&response_type=code&scope=*&redirect_uri=ios-identity-framework://identity&state=${state}&prompt=none&device=${deviceId}&advertising_id=00000000-0000-0000-0000-000000000000&layout=ios_cx&client_version=6.11.0&dv_cx_identity_guided_phone_exp=false&is_nav_switcher_on=true&intl=en-US`