let notifications = {};

const setNotification = (property, value) => {
  notifications[property] = value;
}

const getNotifications = () => {
  const notificationCopy = { ...notifications };
  notifications = {};
  return notificationCopy;
}

module.exports = {
  setNotification,
  getNotifications
};