// pubnubConfig.js
const PubNub = require('pubnub');
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  secretKey: process.env.PUBNUB_SECRET_KEY, // Secret key ekleyin
  uuid: uuidv4() // Backend için benzersiz bir ID
});

module.exports = pubnub;
