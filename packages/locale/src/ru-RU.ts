import { Localization } from "@sse-auth/types/localization";

export const ruRU: Localization = {
  id: "Русский",
  signIn: {
    title: "Войдите в свою учетную запись",
    subtitle: "С возвращением! Введите свои данные, чтобы продолжить.",
    label_email: "Адрес электронной почты",
    label_password: "Пароль",
    label_phone: "Номер телефона",
    link_forgotPassword: "Забыли пароль?",
    submit_text: "Войти",
    divider_text: "Или продолжите с",
    social_text: "Войти с помощью {{provider}}",
    link_dontHaveAnAccount: "Нет учетной записи?",
    createAccount: "Создать учетную запись",
  },
  signUp: {
    title: "Создайте свою учетную запись",
    subtitle: "Введите свои данные, чтобы создать учетную запись и начать.",
    label_email: "Адрес электронной почты",
    label_password: "Пароль",
    label_phone: "Номер телефона",
    label_name: "Имя",
    submit_text: "Создать учетную запись",
    divider_text: "Или продолжите с",
    link_haveAnAccount: "Уже есть учетная запись?",
    login: "Вход",
    label_firstName: "Имя",
    label_lastName: "Фамилия",
  },
  user: {
    dropdown: {
      manage: "Управление",
      signOut: "Выйти",
      switchAccount: "Сменить учетную запись",
      preferences: "Настройки",
      help: "Помощь",
      sendFeedback: "Отправить отзыв",
    },
    edit: {
      sidebar: {
        account: "Учетная запись",
        security: "Безопасность",
        help: "Помощь",
      },
      accounts: {
        title: "Учетная запись",
        subtitle: "Управляйте информацией о своей учетной записи",
        profile: "Профиль",
        emailAddresses: {
          title: "Адреса электронной почты",
          primaryEmailAddress: "Основной адрес электронной почты",
          primaryEmailAddress_subtitle:
            "Этот адрес электронной почты является основным",
          remove: "Удалить",
          remove_subtitle:
            "Удалите этот адрес электронной почты и уберите его из своей учетной записи",
          removeemailAddress: "Удалить адрес электронной почты",
          addAsEmailAddress: "Добавить адрес электронной почты",
        },
        connectedAccounts: {
          title: "Подключенные учетные записи",
          connectAccount: "Подключить учетную запись",
          remove: "Удалить",
          remove_subtitle:
            "Удалить эту подключенную учетную запись из вашей учетной записи",
          removeConnectAccount: "Удалить подключенную учетную запись",
        },
      },
      security: {
        title: "Безопасность",
        password: "Пароль",
        setPassword: "Установить пароль",
        activeDevices: "Активные устройства",
        changePassword: "Изменить пароль",
      },
      setPassword: {
        title: "Установить пароль",
        newPassword: "Новый пароль",
        confirmPassword: "Подтвердите пароль",
        lenError: "Ваш пароль должен содержать 8 или более символов.",
        confirmPasswordError: "Пароль не совпадает",
        signOutAllDevices: "Выйти со всех других устройств",
        cancel: "ОТМЕНА",
        continue: "Продолжить",
      },
      addConnectedAccount: {
        title: "Добавить подключенные устройства",
        noProviderError: "Нет доступных внешних провайдеров учетных записей.",
        cancel: "ОТМЕНА",
      },
      updateProfile: {
        title: "Обновить профиль",
        profileImage: "Изображение профиля",
        uploadImage: "Загрузить изображение",
        removeImage: "Удалить изображение",
        cancel: "ОТМЕНА",
        continue: "Продолжить",
      },
    },
  },
};
