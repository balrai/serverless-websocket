const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const WebSocket = require("../common/websocketMessage");

const usersTableName = process.env.tableName1;
const emojiTableName = process.env.tableName2;

exports.handler = async event => {
  console.log("event", event);

  const {
    connectionId: connectionID,
    domainName,
    stage
  } = event.requestContext;

  const data = {
    ID: connectionID,
    date: Date.now(),
    domainName,
    stage
  };

  try {
    await Dynamo.write(data, usersTableName);
    return Responses._200({ message: "connected" });
  } catch (err) {
    console.log("Error in connect.js: ", err);
    return Responses._400({ message: "Error connecting. ", err });
  }
};
