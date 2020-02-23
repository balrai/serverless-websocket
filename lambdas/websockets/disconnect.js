const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");

const usersTableName = process.env.tableName1;

exports.handler = async event => {
  console.log("event", event);

  const { connectionId: connectionID } = event.requestContext;

  await Dynamo.delete(connectionID, usersTableName);

  return Responses._200({ message: "disconnected" });
};
