import { Localization } from "@sse-auth/types/localization";

export const viVN: Localization = {
  id: "Tiếng Việt",
  signIn: {
    title: "Đăng nhập vào tài khoản của bạn",
    subtitle: "Chào mừng trở lại! Nhập thông tin của bạn để tiếp tục.",
    label_email: "Địa chỉ email",
    label_password: "Mật khẩu",
    label_phone: "Số điện thoại",
    link_forgotPassword: "Quên mật khẩu?",
    submit_text: "Đăng nhập",
    divider_text: "Hoặc tiếp tục với",
    social_text: "Đăng nhập với {{provider}}",
    link_dontHaveAnAccount: "Chưa có tài khoản?",
    createAccount: "Tạo tài khoản",
  },
  signUp: {
    title: "Tạo tài khoản của bạn",
    subtitle: "Nhập thông tin của bạn để tạo tài khoản và bắt đầu.",
    label_email: "Địa chỉ email",
    label_password: "Mật khẩu",
    label_phone: "Số điện thoại",
    label_name: "Tên",
    submit_text: "Tạo tài khoản",
    divider_text: "Hoặc tiếp tục với",
    link_haveAnAccount: "Đã có tài khoản?",
    login: "Đăng nhập",
    label_firstName: "Tên",
    label_lastName: "Họ",
  },
  user: {
    dropdown: {
      manage: "Quản lý",
      signOut: "Đăng xuất",
      switchAccount: "Chuyển tài khoản",
      preferences: "Tùy chọn",
      help: "Trợ giúp",
      sendFeedback: "Gửi phản hồi",
    },
    edit: {
      sidebar: { account: "Tài khoản", security: "Bảo mật", help: "Trợ giúp" },
      accounts: {
        title: "Tài khoản",
        subtitle: "Quản lý thông tin tài khoản của bạn",
        profile: "Hồ sơ",
        emailAddresses: {
          title: "Địa chỉ email",
          primaryEmailAddress: "Địa chỉ email chính",
          primaryEmailAddress_subtitle:
            "Địa chỉ email này là địa chỉ email chính",
          remove: "Xóa",
          remove_subtitle:
            "Xóa địa chỉ email này và loại bỏ nó khỏi tài khoản của bạn",
          removeemailAddress: "Xóa địa chỉ email",
          addAsEmailAddress: "Thêm địa chỉ email",
        },
        connectedAccounts: {
          title: "Tài khoản đã kết nối",
          connectAccount: "Kết nối tài khoản",
          remove: "Xóa",
          remove_subtitle:
            "Xóa tài khoản đã kết nối này khỏi tài khoản của bạn",
          removeConnectAccount: "Xóa tài khoản đã kết nối",
        },
      },
      security: {
        title: "Bảo mật",
        password: "Mật khẩu",
        setPassword: "Đặt mật khẩu",
        activeDevices: "Thiết bị đang hoạt động",
        changePassword: "Đổi mật khẩu",
      },
      setPassword: {
        title: "Đặt mật khẩu",
        newPassword: "Mật khẩu mới",
        confirmPassword: "Xác nhận mật khẩu",
        lenError: "Mật khẩu của bạn phải chứa 8 ký tự trở lên.",
        confirmPasswordError: "Mật khẩu không khớp",
        signOutAllDevices: "Đăng xuất khỏi tất cả các thiết bị khác",
        cancel: "HỦY",
        continue: "Tiếp tục",
      },
      addConnectedAccount: {
        title: "Thêm thiết bị đã kết nối",
        noProviderError:
          "Không có nhà cung cấp tài khoản bên ngoài nào khả dụng.",
        cancel: "HỦY",
      },
      updateProfile: {
        title: "Cập nhật hồ sơ",
        profileImage: "Hình ảnh hồ sơ",
        uploadImage: "Tải lên hình ảnh",
        removeImage: "Xóa hình ảnh",
        cancel: "HỦY",
        continue: "Tiếp tục",
      },
    },
  },
};
