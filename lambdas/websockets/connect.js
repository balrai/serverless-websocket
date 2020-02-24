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
    // TODO:  for live viewers, get all the connection ID and send data

    // get emoji data for sending to newly connected users
    const emojiData = await Dynamo.getEmojiData(emojiTableName);
    console.log("emoji data: ", emojiData);

    await WebSocket.send(domainName, stage, connectionID, emojiData[0]);

    // return Responses._200({ message: "conn", data: emojiData[0] });

    return {
      statusCode: 200,
      body: "Hello from Connect Lambda"
    };
  } catch (err) {
    console.log("Error in connect.js: ", err);
    return Responses._400({ message: "Error connecting. ", err });
  }
};
