let MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let url = "mongodb+srv://admin:P@ssw0rd@db-internet-banking-hoydq.gcp.mongodb.net";

let dbName = 'DB'
const Insert = async function(collectionName, data) {
    // Insert some documents
    await MongoClient.connect(url, async function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            let client = db.db(dbName);
            let collection = client.collection(collectionName);
            await collection.insertMany(data, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted documents into the collection ", result);
            });

            db.close();
            console.log("Closed connection to server");
        }
    });
};

const Update = async function(collectionName, data, condition){
    await MongoClient.connect(url, async function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            let client = db.db(dbName);
            let collection = client.collection(collectionName);
            await collection.updateMany(condition, {$set: data}, function(err, result) {
                assert.equal(err, null);
                console.log("Updated documents into the collection ", result);
            });

            db.close();
            console.log("Closed connection to server");
        }
    });
};

const Delete = async function(collectionName, condition){
    await MongoClient.connect(url, async function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            let client = db.db(dbName);
            let collection = client.collection(collectionName);
            await collection.deleteMany(condition, function(err, result) {
                assert.equal(err, null);
                console.log("Deleted documents from the collection ", result);
            });

            db.close();
            console.log("Closed connection to server");
        }
    });
};

const Find = async function(collectionName, condition, sort, limit=0){
    await MongoClient.connect(url, async function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            let client = db.db(dbName);
            let collection = client.collection(collectionName);
            await collection.find(condition).sort(sort).limit(limit).toArray( function(err, result) {
                assert.equal(err, null);
                console.log("Find documents into the collection ", result);
            });

            db.close();
            console.log("Closed connection to server");
        }
    });
};

let database = {
    Insert, // Usage: Insert("customer", [object,object,...])
    Update, // Usage: Update("customer", {a:2,b:3}, {a:1})
    Delete, // Usage: Update("customer", {a:1})
    Find    // Usage: Find("customer", {"typeAccount":"TKTK"}, {numberAccount: -1});
            //        Find("customer", {"typeAccount":"TKTK"}, {numberAccount: 1}, 2);
}

module.exports = database;