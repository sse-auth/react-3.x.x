import { Localization } from "@sse-auth/types/localization";

export const deDE: Localization = {
  id: "German",
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
      sidebar: { account: "Konto", security: "Sicherheit", help: "Hilfe" },
      accounts: {
        title: "Konto",
        subtitle: "Verwalten Sie Ihre Kontoinformationen",
        profile: "Profil",
        emailAddresses: {
          title: "E-Mail-Adressen",
          primaryEmailAddress: "Primäre E-Mail-Adresse",
          primaryEmailAddress_subtitle:
            "Die E-Mail-Adresse ist die primäre E-Mail-Adresse",
          remove: "Entfernen",
          remove_subtitle:
            "Löschen Sie diese E-Mail-Adresse und entfernen Sie sie aus Ihrem Konto",
          removeemailAddress: "E-Mail-Adresse entfernen",
          addAsEmailAddress: "E-Mail-Adresse hinzufügen",
        },
        connectedAccounts: {
          title: "Verbundene Konten",
          connectAccount: "Konto verbinden",
          remove: "Entfernen",
          remove_subtitle:
            "Entfernen Sie dieses verbundene Konto von Ihrem Konto",
          removeConnectAccount: "Verbundenes Konto entfernen",
        },
      },
      security: {
        title: "Sicherheit",
        password: "Passwort",
        setPassword: "Passwort festlegen",
        activeDevices: "Aktive Geräte",
        changePassword: "Passwort ändern",
      },
      setPassword: {
        title: "Passwort festlegen",
        newPassword: "Neues Passwort",
        confirmPassword: "Passwort bestätigen",
        lenError: "Ihr Passwort muss aus 8 oder mehr Zeichen bestehen.",
        confirmPasswordError: "Passwort stimmt nicht überein",
        signOutAllDevices: "Von allen anderen Geräten abmelden",
        cancel: "ABBRECHEN",
        continue: "Fortfahren",
      },
      addConnectedAccount: {
        title: "Verbundene Geräte hinzufügen",
        noProviderError:
          "Es sind keine verfügbaren externen Kontenanbieter vorhanden.",
        cancel: "ABBRECHEN",
      },
      updateProfile: {
        title: "Profil aktualisieren",
        profileImage: "Profilbild",
        uploadImage: "Bild hochladen",
        removeImage: "Bild entfernen",
        cancel: "ABBRECHEN",
        continue: "Fortfahren",
      },
    },
  },
};
