const Database = require("./database");

async function isValidUser(phoneNumber) {
  const database = new Database();
  database.connect();
  const query = "SELECT * FROM ?? WHERE ?? = ?";
  const inserts = ["users", "phone_number", phoneNumber];
  const results = await database.query(query, inserts);
  database.disconnect();
  return results.length === 1;
}

async function isValidDevice(deviceId) {
  const database = new Database();
  database.connect();
  const query = "SELECT * FROM ?? WHERE ?? = ?";
  const inserts = ["devices", "device_id", deviceId];
  const results = await database.query(query, inserts);
  database.disconnect();
  return results.length === 1;
}

function isLoggedIn() {
  return (req, res, next) => {
    if (!req.session.loggedIn) {
      res.redirect("/user/login");
    }

    next();
  };
}

async function getUser(phoneNumber) {
  const database = new Database();
  database.connect();
  const query = "SELECT * FROM ?? WHERE ?? = ?";
  const inserts = ["users", "phone_number", phoneNumber];
  const results = await database.query(query, inserts);
  database.disconnect();
  return results[0];
}

module.exports = {
  isValidUser,
  isValidDevice,
  isLoggedIn,
  getUser
};
