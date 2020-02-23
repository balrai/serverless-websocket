const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const WebSocket = require("../common/websocketMessage");

const usersTableName = process.env.tableName1;
const emojiTableName = process.env.tableName2;

exports.handler = async event => {
  console.log("event", event);

  //   const { connectionId: connectionID } = event.requestContext;

  const body = JSON.parse(event.body);

  try {
    // const record = await Dynamo.get(connectionID, usersTableName);
    // const { messages, domainName, stage } = record;

    // TODO: get emoji data
    const emojiData = await Dynamo.getEmojiData(emojiTableName);
    console.log("emojiData: ", emojiData);

    // get all connectionID
    const connectionIDs = await Dynamo.getAllID(usersTableName);
    console.log("connectionIDs: ", connectionIDs);

    // update emoji data and write back
    const userInput = body.message;

    switch (userInput) {
      case "like":
        emojiData[0].like += 1;
        break;

      case "dislike":
        emojiData[0].dislike += 1;
        break;

      case "love":
        emojiData[0].love += 1;

      default:
        break;
    }
    await Dynamo.writeEmoji(emojiData[0], emojiTableName);

    // send updated emoji data to all connections
    let responseArray = connectionIDs.map(async record => {
      const { domainName, stage, connectionID } = record;
      await WebSocket.send({
        domainName,
        stage,
        connectionID,
        data: emojiData
      });
    });

    await Promise.all(responseArray);

    return Responses._200({ message: "got a message" });
  } catch (err) {
    return Responses._400({ message: "message could not be recieved" });
  }
};
