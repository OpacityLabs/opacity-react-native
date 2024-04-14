
export interface CodeResponse {
    token: {
        token: string;
        refresh_token: string;
    };
    user_info: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        is_active: boolean;
        user_locale_preference: {
            language: string;
        };
        auth_version: number;
        tenant_id: string;
        created_at: string;
    };

}



export const submitCode = async (code:string): Promise<CodeResponse> => {
  const resp = await fetch('https://identity.doordash.com/api/v1/auth/token', {
    method: 'POST',
    headers: {
      // 'Host': 'identity.doordash.com',
      'accept': 'application/json',
      'content-type': 'application/json',
      'user-agent': 'DoorDash/167648 CFNetwork/1485 Darwin/23.1.0',
      'accept-language': 'en-US,en;q=0.9',
      'authorization': 'FuOLnL6SwVUAAAAAAAAAAF7whaV0MUbFAAAAAAAAAACUHvuFj9PQQAAAAAAAAAAA'
    },
    body: JSON.stringify({
      'code': {
        'code': code
      }
    })
  });

  if (!resp.ok) {
    throw new Error('Failed to submit code');
  }

  return await resp.json() as CodeResponse


}