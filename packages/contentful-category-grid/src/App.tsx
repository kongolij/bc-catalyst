import type { AppExtensionSDK, FieldExtensionSDK, KnownAppSDK } from '@contentful/app-sdk';
import { locations } from '@contentful/app-sdk';
import { AppConfig } from './locations/AppConfig';
import { EntryField } from './locations/EntryField';
export function App({ sdk }: { sdk: KnownAppSDK }) {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) return <AppConfig sdk={sdk as AppExtensionSDK} />;
  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) return <EntryField sdk={sdk as FieldExtensionSDK} />;
  return <main className="shell"><h1>Unsupported app location</h1></main>;
}
