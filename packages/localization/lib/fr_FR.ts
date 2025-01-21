import { Localization } from "@sse-auth/types/localization";

export const frFR: Localization = {
  id: "Français",
  signIn: {
    title: "Connectez-vous à votre compte",
    subtitle: "Bienvenue à nouveau ! Entrez vos informations pour continuer.",
    label_email: "Adresse e-mail",
    label_password: "Mot de passe",
    label_phone: "Numéro de téléphone",
    link_forgotPassword: "Mot de passe oublié ?",
    submit_text: "Se connecter",
    divider_text: "Ou continuez avec",
    social_text: "Connectez-vous avec {{provider}}",
    link_dontHaveAnAccount: "Vous n'avez pas de compte ?",
    createAccount: "Créer un compte",
  },
  signUp: {
    title: "Créez votre compte",
    subtitle: "Entrez vos informations pour créer un compte et commencer.",
    label_email: "Adresse e-mail",
    label_password: "Mot de passe",
    label_phone: "Numéro de téléphone",
    label_name: "Nom",
    submit_text: "Créer un compte",
    divider_text: "Ou continuez avec",
    link_haveAnAccount: "Vous avez déjà un compte ?",
    login: "Connexion",
    label_firstName: "Prénom",
    label_lastName: "Nom de famille",
  },
  user: {
    dropdown: {
      manage: "Gérer",
      signOut: "Se déconnecter",
      switchAccount: "Changer de compte",
      preferences: "Préférences",
      help: "Aide",
      sendFeedback: "Envoyer des commentaires",
    },
    edit: {
      account: "Compte",
      security: "Sécurité",
      help: "Aide",
    },
  },
};
