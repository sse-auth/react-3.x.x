/** TODO: Check if all these are used/correct */
import "./error.css";
export type ErrorPageParam = "Configuration" | "AccessDenied" | "Verification";

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

export function Error(props: ErrorProps) {
  const { url, error = "default" } = props;
  const signInPageUrl = `${url}/signin`;

  const errors: Record<ErrorPageParam | "default", ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <div className="mt-6">
          <a
            href={url?.origin}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            // prefetch={false}
          >
            {url?.host}
          </a>
        </div>
      ),
    },
    Configuration: {
      status: 500,
      heading: "Configuration Error",
      message: (
        <div>
          <p className="mt-4 text-lg text-muted-foreground">
            There is a problem with the server configuration.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Check the server logs for more information.
          </p>
        </div>
      ),
    },
    AccessDenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <div>
          <p className="mt-4 text-lg text-muted-foreground">
            You do not have permission to sign in.
          </p>
          <div className="mt-6">
            <a
              href={signInPageUrl}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              // prefetch={false}
            >
              Sign in
            </a>
          </div>
        </div>
      ),
    },
    Verification: {
      status: 403,
      heading: "Unable to sign in",
      message: <></>,
    },
  };

  const { status, heading, message, signin } = errors[error] ?? errors.default;

  // return (
  //   <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
  //     <div className="mx-auto max-w-md text-center">
  //       <div className="mx-auto h-12 w-12 text-primary" />
  //       <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
  //         404
  //       </h1>
  //       <p className="mt-4 text-lg text-muted-foreground">
  //         Oops, it looks like the page you're looking for doesn't exist.
  //       </p>
  //       <div className="mt-6">
  //         <a
  //           href="#"
  //           className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
  //           // prefetch={false}
  //         >
  //           Go to Homepage
  //         </a>
  //       </div>
  //     </div>
  //   </div>
  // );

  return {
    status,
    html: (
      <div>
        <h2>{heading}</h2>
        <div>{message}</div>
        {signin}
      </div>
    ),
  };
}

export default Error