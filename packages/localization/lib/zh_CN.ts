import { Localization } from "@sse-auth/types/localization";

export const zhCN: Localization = {
  id: "简体中文",
  signIn: {
    title: "登录您的账户",
    subtitle: "欢迎回来！请输入您的详细信息以继续。",
    label_email: "电子邮件地址",
    label_password: "密码",
    label_phone: "电话号码",
    link_forgotPassword: "忘记密码了吗？",
    submit_text: "登录",
    divider_text: "或使用以下方式继续",
    social_text: "使用 {{provider}} 登录",
    link_dontHaveAnAccount: "还没有账户？",
    createAccount: "创建账户",
  },
  signUp: {
    title: "创建您的账户",
    subtitle: "输入您的详细信息以创建账户并开始使用。",
    label_email: "电子邮件地址",
    label_password: "密码",
    label_phone: "电话号码",
    label_name: "姓名",
    submit_text: "创建账户",
    divider_text: "或使用以下方式继续",
    link_haveAnAccount: "已经有账户了吗？",
    login: "登录",
    label_firstName: "名字",
    label_lastName: "姓氏",
  },
  user: {
    dropdown: {
      manage: "管理",
      signOut: "登出",
      switchAccount: "切换账户",
      preferences: "偏好设置",
      help: "帮助",
      sendFeedback: "发送反馈",
    },
    edit: {
      account: "账户",
      security: "安全",
      help: "帮助",
    },
  },
};
