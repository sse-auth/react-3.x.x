const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// Define the localization object
const localizationData = {
  enUS: {
    id: "English",
    signIn: {
      title: "Sign in to your account",
      subtitle: "Welcome back! Enter your details to continue.",
      label_email: "Email address",
      label_password: "Password",
      label_phone: "Phone number",
      link_forgotPassword: "Forgot your password?",
      submit_text: "Sign in",
      divider_text: "Or continue with",
      social_text: "Sign in with {{provider}}",
      link_dontHaveAnAccount: "Don't have an account?",
      createAccount: "Create Account",
    },
    signUp: {
      title: "Create your account",
      subtitle: "Enter your details to create an account and get started.",
      label_email: "Email address",
      label_password: "Password",
      label_phone: "Phone number",
      label_name: "Name",
      submit_text: "Create account",
      divider_text: "Or continue with",
      link_haveAnAccount: "Already have an account?",
      login: "Login",
      label_firstName: "First Name",
      label_lastName: "Last Name",
    },
    user: {
      dropdown: {
        manage: "Manage",
        signOut: "Sign Out",
        switchAccount: "Switch Account",
        preferences: "Preferences",
        help: "Help",
        sendFeedback: "Send Feedback",
      },
      edit: {
        sidebar: { account: "Account", security: "Security", help: "Help" },
        accounts: {
          title: "Account",
          subtitle: "Manage your account information",
          profile: "Profile",
          emailAddresses: {
            title: "Email Addresses",
            primaryEmailAddress: "Primary Email Address",
            primaryEmailAddress_subtitle:
              "The email address is the primary email address",
            remove: "Remove",
            remove_subtitle:
              "Delete this meail address and remove it from your account",
            removeemailAddress: "Remove email address",
            addAsEmailAddress: "Add an email address",
          },
          connectedAccounts: {
            title: "Connected Accounts",
            connectAccount: "Connect Account",
            remove: "Remove",
            remove_subtitle: "Remove this connected account from your account",
            removeConnectAccount: "Remove connected account",
          },
        },
        security: {
          title: "Security",
          password: "Password",
          setPassword: "Set Password",
          activeDevices: "Active Devices",
          changePassword: "Change Password",
        },
        setPassword: {
          title: "Set Password",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          lenError: "Your password nust contains 8 or more charactes.",
          confirmPasswordError: "Password doesn't match",
          signOutAllDevices: "Sign out of all other devices",
          cancel: "CANCEL",
          continue: "Continue",
        },
        addConnectedAccount: {
          title: "Add COnnected Devices",
          noProviderError: "There are no available external account providers.",
          cancel: "CANCEL",
        },
        updateProfile: {
          title: "Update Profile",
          profileImage: "Profile Image",
          uploadImage: "Upload Image",
          removeImage: "Remove Image",
          cancel: "CANCEL",
          continue: "Continue",
        },
      },
    },
  },
};

// Define the target languages and their corresponding file paths
const targetLanguages = {
  ar: "lib/ar_AE.ts",
  zh_CN: "lib/zh_CN.ts",
  zh_TW: "lib/zh_TW.ts",
  en: "lib/en_US.ts",
  fr: "lib/fr_FR.ts",
  de: "lib/de_DE.ts",
  it: "lib/it_IT.ts",
  ja: "lib/jp_JP.ts",
  ko: "lib/ko_KR.ts",
  pt: "lib/pt_PT.ts",
  ru: "lib/ru_RU.ts",
  es: "lib/es_ES.ts",
  vi: "lib/vi_VN.ts",
  hi: "lib/hi_IN.ts",
};

// Function to translate text using MyMemory API
const translateText = async (text, targetLang) => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=en|${targetLang}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.responseData.translatedText; // Adjust based on actual response structure
};

// Function to translate the localization object
const translateLocalization = async (localization, targetLang) => {
  const translatedLocalization = {};
  for (const [key, value] of Object.entries(localization)) {
    if (typeof value === "string") {
      // console.log(`Translating "${value}" to ${targetLang}`);
      translatedLocalization[key] = await translateText(value, targetLang);
    } else if (typeof value === "object") {
      translatedLocalization[key] = await translateLocalization(
        value,
        targetLang
      );
    } else {
      translatedLocalization[key] = value; // Keep other types as is
    }
  }
  return translatedLocalization;
};

// Function to ensure the directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Function to generate localization files
// const generateLocalizationFiles = async () => {
//   for (const [langCode, filePath] of Object.entries(targetLanguages)) {
//     const translatedData = await translateLocalization(
//       localizationData.enUS,
//       langCode
//     );
//     const content = `import { Localization } from "@sse-auth/types/localization";

// export const ${langCode}: Localization = ${JSON.stringify(
//       translatedData,
//       null,
//       2
//     )};
// `;

//     // Ensure the directory exists before writing the file
//     ensureDirectoryExists(filePath);

//     fs.writeFileSync(path.join(__dirname, filePath), content, "utf8");
//     console.log(`Generated localization file for ${langCode}: ${filePath}`);
//   }
// };

// Function to generate localization files
const generateLocalizationFiles = async () => {
  for (const [langCode, filePath] of Object.entries(targetLanguages)) {
    let localizationDataToUse;

    // Check if the target language is English
    if (langCode === "en") {
      // Use the existing English localization data
      localizationDataToUse = localizationData.enUS;
    } else {
      // Translate the localization data for other languages
      localizationDataToUse = await translateLocalization(
        localizationData.enUS,
        langCode
      );
    }

    const content = `import { Localization } from "@sse-auth/types/localization";

export const ${langCode}: Localization = ${JSON.stringify(
      localizationDataToUse,
      null,
      2
    )};
`;

    // Ensure the directory exists before writing the file
    ensureDirectoryExists(filePath);

    fs.writeFileSync(path.join(__dirname, filePath), content, "utf8");
    console.log(`Generated localization file for ${langCode}: ${filePath}`);
  }
};

// Execute the localization file generation
generateLocalizationFiles().catch((error) => {
  console.error("Error generating localization files:", error);
});
