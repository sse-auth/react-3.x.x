import { Localization } from "@sse-auth/types/localization";

export const zhTW: Localization = {
  id: "繁體中文",
  signIn: {
    title: "登入您的帳戶",
    subtitle: "歡迎回來！請輸入您的詳細資訊以繼續。",
    label_email: "電子郵件地址",
    label_password: "密碼",
    label_phone: "電話號碼",
    link_forgotPassword: "忘記密碼了嗎？",
    submit_text: "登入",
    divider_text: "或使用以下方式繼續",
    social_text: "使用 {{provider}} 登入",
    link_dontHaveAnAccount: "還沒有帳戶？",
    createAccount: "創建帳戶",
  },
  signUp: {
    title: "創建您的帳戶",
    subtitle: "輸入您的詳細資訊以創建帳戶並開始使用。",
    label_email: "電子郵件地址",
    label_password: "密碼",
    label_phone: "電話號碼",
    label_name: "姓名",
    submit_text: "創建帳戶",
    divider_text: "或使用以下方式繼續",
    link_haveAnAccount: "已經有帳戶了嗎？",
    login: "登入",
    label_firstName: "名字",
    label_lastName: "姓氏",
  },
  user: {
    dropdown: {
      manage: "管理",
      signOut: "登出",
      switchAccount: "切換帳戶",
      preferences: "偏好設定",
      help: "幫助",
      sendFeedback: "發送反饋",
    },
    edit: {
      account: "帳戶",
      security: "安全性",
      help: "幫助",
    },
  },
};
