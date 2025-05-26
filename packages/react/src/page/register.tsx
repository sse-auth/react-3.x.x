import Card from '../components/sse-ui/Card';
import Button from '../components/sse-ui/Button';
import { Text, Link, Caption, Title } from '../components/sse-ui/typography';
import Input from '../components/sse-ui/Input';
import Label from '../components/sse-ui/Label';
import Separator from '../components/sse-ui/Separator';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useBodyClass } from '../lib/useClass';

export function Register() {
  const { localization } = useLocalization();
  const { configInternal } = useAuth();
  useBodyClass(
    'antialiased bg-gray-50 dark:[--body-text-color:theme(colors.gray.300)] dark:bg-gray-950 font-sans'
  );

  const providers = configInternal.providers;

  return (
    <>
      <main className="z-10 m-auto h-fit max-w-md items-center justify-center px-6 py-12 lg:absolute">
        <Card className="relative h-fit p-1 shadow-xl shadow-gray-950/10" variant="mixed">
          <div className="p-10" data-rounded="large">
            <div>
              <Title size="xl" className="mb-1">
                Welcome to SSE Auth
              </Title>
              <Text className="my-0" size="sm">
                {localization.signUp.subtitle ?? 'Create an account to continue'}
              </Text>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {providers.map((provider, index) => {
                if (provider.type === 'oauth' || provider.type === 'oidc') {
                  return (
                    <Button.Root
                      variant="outlined"
                      intent="gray"
                      size="sm"
                      className="w-full"
                      key={index}
                    >
                      <Button.Icon type="leading" size="xs">
                        {provider.style?.icon}
                      </Button.Icon>
                      <Button.Label>{provider.name}</Button.Label>
                    </Button.Root>
                  );
                }
              })}
            </div>

            <form className="mx-auto mt-8 space-y-6">
              <div className="space-y-6 rounded-[--btn-radius] shadow-sm shadow-gray-500/5">
                <div className="relative my-6 grid [grid-template-columns:1fr_auto_1fr] items-center gap-3">
                  <Separator className="h-px border-b" />
                  <Caption as="span" className="block" size="sm">
                    {localization.signUp.divider_text ?? 'Or continue with'}
                  </Caption>
                  <Separator />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label size="sm" htmlFor="firstname">
                      {localization.signUp.label_firstName ?? 'First name'}
                    </Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      required
                      variant="outlined"
                      size="md"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label size="sm" htmlFor="lastname">
                      {localization.signUp.label_lastName ?? 'Last name'}
                    </Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      type="text"
                      required
                      variant="outlined"
                      size="md"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label size="sm" htmlFor="email">
                      {localization.signUp.label_email ?? 'Email address'}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      variant="outlined"
                      size="md"
                    />
                  </div>
                  <div className="space-y-2.5">
                    {/* <div className="flex items-center justify-between"> */}
                    <Label size="sm" htmlFor="password">
                      {localization.signUp.label_password ?? 'Password'}
                    </Label>
                    {/* </div> */}
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      variant="outlined"
                      size="md"
                    />
                  </div>
                </div>
              </div>

              <Button.Root className="w-full">
                <Button.Label>{localization.signUp.submit_text ?? 'Create Account'}</Button.Label>
              </Button.Root>
            </form>
          </div>

          <Card
            variant="soft"
            data-shade="925"
            className="rounded-[calc(var(--card-radius)-0.25rem)] dark:bg-[--ui-bg]"
          >
            <Caption className="my-0" size="sm" align="center">
              {localization.signUp.link_haveAnAccount ?? 'Already have an account ? '} {''}
              <Link intent="neutral" size="sm" variant="underlined" href="/login">
                {localization.signUp.login ?? 'Login'}
              </Link>
            </Caption>
          </Card>
        </Card>
      </main>
    </>
  );
}
