export interface Localization {
  locale: string;

  // Sign In
  signIn: {
    title: string;
    subtitle: string;
    label_email: string;
    label_password: string;
    label_phone: string;
    link_forgotPassword: string;
    submit_text: string;
    divider_text: string;
    social_text: string;
    link_dontHaveAnAccount: string;
    createAccount: string;
  };

  // Sign Up
  signUp: {
    title: string;
    subtitle: string;
    label_email: string;
    label_password: string;
    label_phone: string;
    label_name: string;
    submit_text: string;
    divider_text: string;
    link_haveAnAccount: string;
    login: string;
    label_firstName: string;
    label_lastName: string;
  };

  // User
  user: {
    // Dropdown
    dropdown: {
      manage: string;
      signOut: string;
      switchAccount: string;
      preferences: string;
      help: string;
      sendFeedback: string;
    };

    // Edit
    edit: {
      sidebar: { account: string; security: string; help: string };
      accounts: {
        title: string;
        subtitle: string;
        profile: string;
        emailAddresses: {
          title: string;
          primaryEmailAddress: string;
          primaryEmailAddress_subtitle: string;
          remove: string;
          remove_subtitle: string;
          removeemailAddress: string;
          addAsEmailAddress: string;
        };
        connectedAccounts: {
          title: string;
          connectAccount: string;
          remove: string;
          remove_subtitle: string;
          removeConnectAccount: string;
        };
      };
      security: {
        title: string;
        password: string;
        setPassword: string;
        changePassword: string;
        activeDevices: string;
      };
      setPassword: {
        title: string;
        newPassword: string;
        confirmPassword: string;
        lenError: string;
        confirmPasswordError: string;
        signOutAllDevices: string;
        cancel: string;
        continue: string;
      };
      addConnectedAccount: {
        title: string;
        noProviderError: string;
        cancel: string;
      };
      updateProfile: {
        title: string;
        profileImage: string;
        uploadImage: string;
        removeImage: string;
        cancel: string;
        continue: string;
      };
    };
  };

  verification: {
    title: string;
    description: string;
  };

  signout: {
    title: string;
    description: string;
  };
}

export type LocalizationKeys<T> = T extends Record<string, any>
  ? {
    [K in keyof T]: K extends string
    ? T[K] extends Record<string, any>
    ? `${K}` | `${K}.${LocalizationKeys<T[K]>}`
    : K
    : never;
  }[keyof T]
  : never;

export type LocalizationKey = LocalizationKeys<Localization>;
