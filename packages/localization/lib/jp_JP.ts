import { Localization } from "@sse-auth/types/localization";

export const jaJP: Localization = {
  id: "日本語",
  signIn: {
    title: "アカウントにサインイン",
    subtitle: "お帰りなさい！続行するには、詳細を入力してください。",
    label_email: "メールアドレス",
    label_password: "パスワード",
    label_phone: "電話番号",
    link_forgotPassword: "パスワードを忘れましたか？",
    submit_text: "サインイン",
    divider_text: "または、次の方法で続行",
    social_text: "{{provider}}でサインイン",
    link_dontHaveAnAccount: "アカウントをお持ちでないですか？",
    createAccount: "アカウントを作成",
  },
  signUp: {
    title: "アカウントを作成",
    subtitle: "アカウントを作成して始めるために、詳細を入力してください。",
    label_email: "メールアドレス",
    label_password: "パスワード",
    label_phone: "電話番号",
    label_name: "名前",
    submit_text: "アカウントを作成",
    divider_text: "または、次の方法で続行",
    link_haveAnAccount: "すでにアカウントをお持ちですか？",
    login: "ログイン",
    label_firstName: "名",
    label_lastName: "姓",
  },
  user: {
    dropdown: {
      manage: "管理",
      signOut: "サインアウト",
      switchAccount: "アカウントを切り替え",
      preferences: "設定",
      help: "ヘルプ",
      sendFeedback: "フィードバックを送信",
    },
    edit: {
      account: "アカウント",
      security: "セキュリティ",
      help: "ヘルプ",
    },
  },
};
