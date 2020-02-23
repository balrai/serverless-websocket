const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

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

  await Dynamo.write(data, usersTableName);
  // TODO:  for live viewers, get all the connection ID and send data

  // get emoji data for sending to newly connected users
  const emojiData = await Dynamo.getEmojiData(emojiTableName);
  console.log("emoji data: ", emojiData);

  return Responses._200({ message: "connected", data: emojiData });
};
