import { Localization } from "@sse-auth/types/localization";

export const itIT: Localization = {
  id: "Italiano",
  signIn: {
    title: "Accedi al tuo account",
    subtitle: "Bentornato! Inserisci i tuoi dati per continuare.",
    label_email: "Indirizzo email",
    label_password: "Password",
    label_phone: "Numero di telefono",
    link_forgotPassword: "Hai dimenticato la password?",
    submit_text: "Accedi",
    divider_text: "Oppure continua con",
    social_text: "Accedi con {{provider}}",
    link_dontHaveAnAccount: "Non hai un account?",
    createAccount: "Crea un account",
  },
  signUp: {
    title: "Crea il tuo account",
    subtitle: "Inserisci i tuoi dati per creare un account e iniziare.",
    label_email: "Indirizzo email",
    label_password: "Password",
    label_phone: "Numero di telefono",
    label_name: "Nome",
    submit_text: "Crea account",
    divider_text: "Oppure continua con",
    link_haveAnAccount: "Hai già un account?",
    login: "Accedi",
    label_firstName: "Nome",
    label_lastName: "Cognome",
  },
  user: {
    dropdown: {
      manage: "Gestisci",
      signOut: "Disconnetti",
      switchAccount: "Cambia account",
      preferences: "Preferenze",
      help: "Aiuto",
      sendFeedback: "Invia feedback",
    },
    edit: {
      sidebar: { account: "Account", security: "Sicurezza", help: "Aiuto" },
      accounts: {
        title: "Account",
        subtitle: "Gestisci le informazioni del tuo account",
        profile: "Profilo",
        emailAddresses: {
          title: "Indirizzi email",
          primaryEmailAddress: "Indirizzo email principale",
          primaryEmailAddress_subtitle:
            "L'indirizzo email è l'indirizzo principale",
          remove: "Rimuovi",
          remove_subtitle:
            "Elimina questo indirizzo email e rimuovilo dal tuo account",
          removeemailAddress: "Rimuovi indirizzo email",
          addAsEmailAddress: "Aggiungi un indirizzo email",
        },
        connectedAccounts: {
          title: "Account collegati",
          connectAccount: "Collega account",
          remove: "Rimuovi",
          remove_subtitle: "Rimuovi questo account collegato dal tuo account",
          removeConnectAccount: "Rimuovi account collegato",
        },
      },
      security: {
        title: "Sicurezza",
        password: "Password",
        setPassword: "Imposta password",
        activeDevices: "Dispositivi attivi",
        changePassword: "Cambia password",
      },
      setPassword: {
        title: "Imposta password",
        newPassword: "Nuova password",
        confirmPassword: "Conferma password",
        lenError: "La tua password deve contenere 8 o più caratteri.",
        confirmPasswordError: "La password non corrisponde",
        signOutAllDevices: "Disconnetti da tutti gli altri dispositivi",
        cancel: "ANNULLA",
        continue: "Continua",
      },
      addConnectedAccount: {
        title: "Aggiungi dispositivi collegati",
        noProviderError:
          "Non ci sono fornitori di account esterni disponibili.",
        cancel: "ANNULLA",
      },
      updateProfile: {
        title: "Aggiorna profilo",
        profileImage: "Immagine del profilo",
        uploadImage: "Carica immagine",
        removeImage: "Rimuovi immagine",
        cancel: "ANNULLA",
        continue: "Continua",
      },
    },
  },
};
