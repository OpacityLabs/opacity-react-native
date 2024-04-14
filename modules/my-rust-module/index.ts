import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to MyRustModule.web.ts
// and on native platforms to MyRustModule.ts
import MyRustModule from "./src/MyRustModule";
import MyRustModuleView from "./src/MyRustModuleView";
import {
  ChangeEventPayload,
  MyRustModuleViewProps,
} from "./src/MyRustModule.types";

// Get the native constant value.
export const PI = MyRustModule.PI;


export interface NotarizationRequestInterface {
  host: string;
  path: string;
  headers: [string, string][];
  body: string;
  redact_strings: string[];
}


export function hello(): string {
  return MyRustModule.hello();
}

export async function start(request:NotarizationRequestInterface): Promise<String>{
  console.log("Starting Rust module with request",request);
  const stringRequest = JSON.stringify(request);
  const resp =  await MyRustModule.start(stringRequest);

  // console.error("Rust returned",resp);
  return resp;
}

export async function setValueAsync(value: string) {
  return await MyRustModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  MyRustModule ?? NativeModulesProxy.MyRustModule
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export { MyRustModuleView, MyRustModuleViewProps, ChangeEventPayload };
