const express = require("express");
const router = express.Router();
const Messenger = require("../helpers/messaging");
const Database = require("../helpers/database");
const messenger = new Messenger();

router.post("/", async function(req, res, next) {
  const { type, deviceId, message } = req.body;
  if (message && deviceId && type) {
    const database = new Database();
    database.connect();
    const query = `
    SELECT * FROM devices d
    INNER JOIN contacts c
    ON c.user_id = d.user_id
    WHERE d.device_id = ?
  `;
    const inserts = [deviceId];
    const results = await database.query(query, inserts);
    database.disconnect();
    results.forEach(
      async ({
        contact_contact_method,
        contact_number,
        contact_name,
        user_id
      }) => {
        const messageToSend = `${type.toUpperCase()}: Hello ${contact_name}, ${message}`;
        await Messenger.sendSMS(
          contact_number,
          contact_name,
          type.toUpperCase(),
          messageToSend,
          user_id
        );
      }
    );
  }
  res.status(200);
  res.end();
});

router.post("/receive", async function(req, res, next) {
  const { Body: reply, From: from } = req.body;
  const type = "confirmation";
  const allOk = reply.includes("yes") || reply.includes("Yes");
  const allNotOk = reply.includes("no") || reply.includes("No");
  const shouldReply = allOk || allNotOk;
  let messageToSend;
  if (allOk) {
    messageToSend = `${type.toUpperCase()}: Thanks for letting us know, have a nice day!`;
  } else if (allNotOk) {
    messageToSend = `${type.toUpperCase()}: We will contact the emergency services and let them know you something is wrong.`;
  }

  if (shouldReply) {
    const database = new Database();
    database.connect();
    const query = `SELECT * from ?? where ?? = ?`;
    const inserts = ["contacts", "contact_number", from];
    const contact = await database.query(query, inserts);
    database.disconnect();
    const { contact_number, contact_name, user_id } = contact[0];
    if (contact_name && contact_number && user_id && type && messageToSend) {
      await messenger.sendSMS(
        contact_number,
        contact_name,
        type.toUpperCase(),
        messageToSend,
        user_id
      );
    }
  }
  res.status(200);
  res.end();
});

module.exports = router;
