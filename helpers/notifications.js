const Database = require("./database");

module.exports = class Notifications {
  async create(
    sent_to,
    sent_to_name,
    sent_message_type,
    sent_message,
    user_id
  ) {
    const database = new Database();
    database.connect();
    const query = "INSERT INTO ?? SET ?";
    const notification = {
      sent_message_type,
      sent_to,
      sent_to_name,
      sent_message,
      user_id
    };
    const inserts = ["notifications", notification];
    await database.query(query, inserts);
    database.disconnect();
  }
};
