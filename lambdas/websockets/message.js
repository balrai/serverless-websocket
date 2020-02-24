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

    if (emojiData.length < 1) {
      emojiData.push({ ID: 1, like: 0, decent: 0, love: 0 });
    }

    switch (userInput) {
      case "like":
        emojiData[0].like += 1;
        break;

      case "decent":
        emojiData[0].decent += 1;
        break;

      case "love":
        emojiData[0].love += 1;

      default:
        break;
    }
    console.log("emojidata on message.js: ", emojiData[0]);
    await Dynamo.writeEmojiData(emojiData[0], emojiTableName);

    // send updated emoji data to all connections
    let responseArray = connectionIDs.map(async record => {
      console.log("record: ", record);
      const { domainName, stage, ID } = record;
      await WebSocket.send({
        domainName,
        stage,
        ID,
        data: emojiData[0]
      });
    });

    await Promise.all(responseArray);

    return Responses._200({ message: "got a message" });
  } catch (err) {
    return Responses._400({ message: "message could not be recieved" });
  }
};
