export type ErrorPageParam = "Configuration" | "AccessDenied" | "Verification";

/**
 * The following errors are passed as error query parameters to the default or overridden error page.
 *
 * [Documentation](https://authjs.dev/guides/pages/error)
 */
export interface ErrorProps {
  url?: URL;
  error?: ErrorPageParam;
}

interface ErrorView {
  status: number;
  heading: string;
  message: JSX.Element;
  signin?: JSX.Element;
}

export default function ErrorPage(props: ErrorProps) {
  const { url, error = "default" } = props;
  const signinPageUrl = `${url}/signin`;

  const errors: Record<ErrorPageParam | "default", ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <p>
          <a className="site" href={url?.origin}>
            {url?.host}
          </a>
        </p>
      ),
    },
    Configuration: {
      status: 500,
      heading: "Server error",
      message: (
        <div>
          <p>There is a problem with the server configuration.</p>
          <p>Check the server logs for more information.</p>
        </div>
      ),
    },
    AccessDenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <div>
          <p>You do not have permission to sign in.</p>
          <p>
            <a className="button" href={signinPageUrl}>
              Sign in
            </a>
          </p>
        </div>
      ),
    },
    Verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <div>
          <p>The sign in link is no longer valid.</p>
          <p>It may have been used already or it may have expired.</p>
        </div>
      ),
      signin: (
        <a className="button" href={signinPageUrl}>
          Sign in
        </a>
      ),
    },
  };

  const { status, heading, message, signin } = errors[error] ?? errors.default;
  return {
    status,
    html: (
      <>
        {/* <style>:root{--background:0 0% 100%;--foreground:240 10% 3.9%;--card:0 0% 100%;--card-foreground:240 10% 3.9%;--popover:0 0% 100%;--popover-foreground:240 10% 3.9%;--primary:240 5.9% 10%;--primary-foreground:0 0% 98%;--secondary:240 4.8% 95.9%;--secondary-foreground:240 5.9% 10%;--muted:240 4.8% 95.9%;--muted-foreground:240 3.8% 45%;--accent:240 4.8% 95.9%;--accent-foreground:240 5.9% 10%;--destructive:0 72% 51%;--destructive-foreground:0 0% 98%;--border:240 5.9% 90%;--input:240 5.9% 90%;--ring:240 5.9% 10%;--chart-1:173 58% 39%;--chart-2:12 76% 61%;--chart-3:197 37% 24%;--chart-4:43 74% 66%;--chart-5:27 87% 67%;--radius:0.5rem;}img[src="/placeholder.svg"],img[src="/placeholder-user.jpg"]{filter:sepia(.3) hue-rotate(-60deg) saturate(.5) opacity(0.8) }</style>
<style>h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; --font-sans-serif: 'Inter'; }
</style>
<style>body { font-family: 'Inter', sans-serif; --font-sans-serif: 'Inter'; }
</style> */}
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
              {status}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{heading}</p>
            <div className="mt-6">
              <div className="message">{message}</div>
              {signin ? (
                <div className="mt-4">{signin}</div>
              ) : (
                <a
                  href="#"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Go to Homepage
                </a>
              )}
            </div>
          </div>
        </div>
      </>
    ),
  };
}
