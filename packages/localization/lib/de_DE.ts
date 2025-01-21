import { Localization } from "@sse-auth/types/localization";

export const deDE: Localization = {
  id: "Deutsch",
  signIn: {
    title: "Melden Sie sich bei Ihrem Konto an",
    subtitle: "Willkommen zurück! Geben Sie Ihre Daten ein, um fortzufahren.",
    label_email: "E-Mail-Adresse",
    label_password: "Passwort",
    label_phone: "Telefonnummer",
    link_forgotPassword: "Passwort vergessen?",
    submit_text: "Anmelden",
    divider_text: "Oder fahren Sie fort mit",
    social_text: "Melden Sie sich mit {{provider}} an",
    link_dontHaveAnAccount: "Haben Sie kein Konto?",
    createAccount: "Konto erstellen",
  },
  signUp: {
    title: "Erstellen Sie Ihr Konto",
    subtitle:
      "Geben Sie Ihre Daten ein, um ein Konto zu erstellen und loszulegen.",
    label_email: "E-Mail-Adresse",
    label_password: "Passwort",
    label_phone: "Telefonnummer",
    label_name: "Name",
    submit_text: "Konto erstellen",
    divider_text: "Oder fahren Sie fort mit",
    link_haveAnAccount: "Haben Sie bereits ein Konto?",
    login: "Einloggen",
    label_firstName: "Vorname",
    label_lastName: "Nachname",
  },
  user: {
    dropdown: {
      manage: "Verwalten",
      signOut: "Abmelden",
      switchAccount: "Konto wechseln",
      preferences: "Einstellungen",
      help: "Hilfe",
      sendFeedback: "Feedback senden",
    },
    edit: {
      account: "Konto",
      security: "Sicherheit",
      help: "Hilfe",
    },
  },
};
