export interface Localization {
  id: string;
  [key: string]: string;

  // Sign In
  signIn_title: string;
  signIn_subtitle: string;
  signIn_label_email: string;
  signIn_label_password: string;
  signIn_label_phone: string;
  signIn_link_forgotPassword: string;
  signIn_submit_text: string;
  signIn_divider_text: string;
  signIn_social_text: string;
  signIn_link_dontHaveAnAccount: string;
  signIn_createAccount: string;

  // Sign Up
  signUp_title: string;
  signUp_subtitle: string;
  signUp_label_email: string;
  signUp_label_password: string;
  signUp_label_phone: string;
  signUp_label_name: string;
  signUp_submit_text: string;
  signUp_divider_text: string;
  signUp_link_haveAnAccount: string;
  signUp_login: string;
  signUp_label_firstName: string;
  signUp_label_lastName: string;

  // User - Dropdown
  user_dropdown_manage: string;
  user_dropdown_signOut: string;
  user_dropdown_switchAccount: string;
  user_dropdown_preferences: string;
  user_dropdown_help: string;
  user_dropdown_sendFeedback: string;

  // User - Edit
  user_edit_account: string;
  user_edit_security: string;
  user_edit_help: string;
}
