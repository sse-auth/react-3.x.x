import { CredentialInput, CredentialsConfig } from '@sse-auth/types/provider';
export * from '@sse-auth/types/provider/credentials';

export default function Credentials<
  CredentialsInputs extends Record<string, CredentialInput> = Record<string, CredentialInput>,
>(config: Partial<CredentialsConfig<CredentialsInputs>>): CredentialsConfig {
  return {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    credentials: {},
    authorize: () => null,
    // @ts-expect-error
    options: config,
  };
}

export { Credentials };
