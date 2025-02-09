import { Localization } from "@sse-auth/types/localization";

export const frFR: Localization = {
  id: "French",
  signIn: {
    title: "Connectez-vous à votre compte",
    subtitle:
      "Content de vous revoir ! Entrez vos informations pour continuer.",
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
      sidebar: { account: "Compte", security: "Sécurité", help: "Aide" },
      accounts: {
        title: "Compte",
        subtitle: "Gérez les informations de votre compte",
        profile: "Profil",
        emailAddresses: {
          title: "Adresses e-mail",
          primaryEmailAddress: "Adresse e-mail principale",
          primaryEmailAddress_subtitle:
            "L'adresse e-mail est l'adresse principale",
          remove: "Supprimer",
          remove_subtitle:
            "Supprimez cette adresse e-mail et retirez-la de votre compte",
          removeemailAddress: "Supprimer l'adresse e-mail",
          addAsEmailAddress: "Ajouter une adresse e-mail",
        },
        connectedAccounts: {
          title: "Comptes connectés",
          connectAccount: "Connecter un compte",
          remove: "Supprimer",
          remove_subtitle: "Supprimez ce compte connecté de votre compte",
          removeConnectAccount: "Supprimer le compte connecté",
        },
      },
      security: {
        title: "Sécurité",
        password: "Mot de passe",
        setPassword: "Définir le mot de passe",
        activeDevices: "Appareils actifs",
        changePassword: "Changer le mot de passe",
      },
      setPassword: {
        title: "Définir le mot de passe",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        lenError: "Votre mot de passe doit contenir 8 caractères ou plus.",
        confirmPasswordError: "Le mot de passe ne correspond pas",
        signOutAllDevices: "Se déconnecter de tous les autres appareils",
        cancel: "ANNULER",
        continue: "Continuer",
      },
      addConnectedAccount: {
        title: "Ajouter des appareils connectés",
        noProviderError: "Aucun fournisseur de compte externe disponible.",
        cancel: "ANNULER",
      },
      updateProfile: {
        title: "Mettre à jour le profil",
        profileImage: "Image de profil",
        uploadImage: "Télécharger l'image",
        removeImage: "Supprimer l'image",
        cancel: "ANNULER",
        continue: "Continuer",
      },
    },
  },
};
