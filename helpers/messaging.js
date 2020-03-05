const Notifications = require("./notifications");

module.exports = class Messenger {
  constructor() {
    this.client = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSMS(to, toName, type, message, user_id) {
    const notifications = new Notifications();
    await notifications.create(to, toName, type, message, user_id);
    this.client.messages.create(
      {
        body: message,
        from: process.env.TWILIO_FROM_PHONE_NUMBER,
        to
      },
      console.error
    );
  }
};
