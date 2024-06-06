import {DEFAULT_DOORDASH_HEADERS, DOORDASH_HOST, ProfileInterface} from '.';
import {
  NotarizationRequestInterface,
  start,
} from '../../modules/my-rust-module';

//`/v2/consumers/me/`

export const notarizeDoorDashRequest = (
  token: string,
  path: string,
  redactStrings: string[] = [],
): NotarizationRequestInterface => ({
  host: DOORDASH_HOST,
  path,
  body: '',
  headers: [['Authorization', `JWT ${token}`], ...DEFAULT_DOORDASH_HEADERS],
  redact_strings: [`JWT ${token}`, ...redactStrings],
  max_sent: 4096,
  max_recv: 32768,
});

export const getProfileRedactStrings = (
  profile: ProfileInterface,
): string[] => [
  // profile.email,
  profile.last_name,
  profile.first_name,
  // profile.phone_number,
  // profile.phone_number_components.formatted_national_number,
  // profile.phone_number_components.formatted_international_number,
  // profile.phone_number_components.international_number,
  // profile.phone_number_components.national_number,
  // profile.default_profile_address.lat.toFixed(2),
  // profile.default_profile_address.lng.toFixed(2),
  profile.default_profile_address.printable_address,
  profile.default_profile_address.subpremise,
  profile.default_profile_address.street,
  profile.default_profile_address.zip_code,
  profile.default_profile_address.shortname,
  profile.default_profile_address.city,
  profile.default_profile_address.state,
];

export const notarizeDoorDashProfileRequest = (
  token: string,
  redactStrings: string[] = [],
) => notarizeDoorDashRequest(token, `/v2/consumers/me/`, redactStrings);

export const generateDoorDashProof = async (
  request: NotarizationRequestInterface,
): Promise<String> => {
  const proof_str = await start(request);
  const proof = JSON.parse(proof_str as string);
  return JSON.stringify(proof);
};
