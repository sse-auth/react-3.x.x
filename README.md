# SSE Authentication For React

`SSE Authentication` is a lightweight authentication library for React applications, designed to simplify the process of managing user authentication and authorization. This library provides a set of hooks and components that make it easy to integrate authentication into your React app.

## Features

- Simple and intuitive API
- Supports various authentication methods (JWT, OAuth, etc.)
- Easy integration with existing React applications
- Customizable authentication flows
- Built-in hooks for managing authentication state

## Installation

```bash
npm install @sse-auth/react
```

or

```bash
yarn add @sse-auth/react
```

## Usage

### Basic Setup

To get started, wrap your application with the `AuthProvider` component. This will provide the authentication context to your entire app.

```jsx
import React from 'react';
import { AuthProvider, ThemeProvider } from 'sse-auth';

const App = () => {
  return (
   <ThemeProvider>
    <AuthProvider>
      {/* Your application components go here */}
    </AuthProvider>
   <ThemeProvider />
  );
};

export default App;
```

## Contributing

We welcome contributions! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgments

We would like to extend my gratitude to [`next-auth`](https://authjs.dev/), [`tailus`](https://ui.tailus.io/) and [`radix-ui`](https://www.radix-ui.com/) from which we drew inspiration for this library. Your work has been invaluable in helping us create a simple and effective authentication solution for React applications.

---

For more information, please refer to the [documentation](#installation) or check out the examples provided in the repository. Happy coding!
