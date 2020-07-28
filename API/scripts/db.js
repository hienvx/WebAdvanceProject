let MongoClient = require("mongodb").MongoClient;

let url =
  "mongodb+srv://admin:P@ssw0rd@db-internet-banking-hoydq.gcp.mongodb.net";

let dbName = "DB";
const Insert = async function (collectionName, data) {
  // Insert some documents
  let db = await MongoClient.connect(url);

  if (!db) {
    return false;
  }
  console.log("Connection established server");
  let client = db.db(dbName);
  let collection = client.collection(collectionName);
  let status = await collection.insertMany(data);

  await db.close();
  console.log("Closed connection to server");
  return status.result.ok > 0;
};

const Update = async function (collectionName, data, condition) {
  let db = await MongoClient.connect(url).catch((err) => {
    console.log(err);
  });

  if (!db) {
    return false;
  }
  console.log("Connection established to server");
  let client = db.db(dbName);
  let collection = client.collection(collectionName);
  let status = await collection.updateMany(condition, { $set: data });

  await db.close();
  console.log("Closed connection to server");

  return status.result.ok > 0;
};

const Delete = async function (collectionName, condition) {
  let db = await MongoClient.connect(url);

  if (!db) {
    return;
  }
  console.log("Connection established to server");
  let client = db.db(dbName);
  let collection = client.collection(collectionName);
  let status = await collection.deleteMany(condition);

  await db.close();
  console.log("Closed connection to server");
  return status.result.ok > 0;
};

const Find = async function (
  collectionName,
  condition = {},
  sort = {},
  limit = 0,
  skip = 0
) {
  let db = await MongoClient.connect(url).catch((err) => {
    console.log(err);
  });

  if (!db) {
    return [];
  }
  console.log("Connection established to server");
  let client = db.db(dbName);
  let collection = client.collection(collectionName);
  let data = await collection
    .find(condition)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .toArray();
  await db.close();
  console.log("Closed connection to server");
  return data;
};

let database = {
  Insert, // Usage: Insert("customer", [object,object,...])
  Update, // Usage: Update("customer", {a:2,b:3}, {a:1})
  Delete, // Usage: Update("customer", {a:1})
  Find, // Usage: Find("customer", {"typeAccount":"TKTK"}, {numberAccount: -1});
  //        Find("customer", {"typeAccount":"TKTK"}, {numberAccount: 1}, 2);
};

module.exports = database;
