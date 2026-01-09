const userNotifications = {};

const setNotification = (user, property, value) => {
  if (!userNotifications[user]) {
    userNotifications[user] = { expires: Date.now() + 1000 };
  }
  userNotifications[user][property] = value;
}

const getNotifications = (user) => {
  if (userNotifications[user]) {
    const notifications = { ...userNotifications[user] };
    delete userNotifications[user]
    return notifications;
  }
  return {};
}

module.exports = {
  setNotification,
  getNotifications
};